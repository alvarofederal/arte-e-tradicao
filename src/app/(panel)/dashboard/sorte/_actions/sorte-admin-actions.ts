"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/slug"
import { gerarCodigosUnicos, obterLoteCodigos } from "@/lib/codigo-sorte"

async function exigirEquipe() {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/sorte")
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "LOJISTA") {
    redirect("/minha-conta")
  }
  return session.user
}

const schema = z.object({
  santoId: z.string().min(1, "Escolha o Santo da caixa."),
  lote: z.string().trim().max(60).optional().default(""),
  liberarJa: z.boolean().default(false),
  distribuicao: z
    .array(
      z.object({
        // 0 = sem prêmio · 1..50 = desconto · 100 = grátis (quebra-cabeça grátis)
        descontoPercent: z
          .number()
          .int()
          .min(0)
          .max(100)
          .refine((n) => n === 0 || n === 100 || (n >= 1 && n <= 50), "Desconto deve ser 1–50%, Grátis (100%) ou Sem prêmio (0)."),
        quantidade: z.number().int().min(1).max(5000),
      }),
    )
    .min(1, "Adicione ao menos uma faixa de prêmio."),
})

export type GerarLoteInput = z.input<typeof schema>
export type GerarLoteResult =
  | { ok: true; lote: string; total: number }
  | { ok: false; error: string }

export async function gerarLote(input: GerarLoteInput): Promise<GerarLoteResult> {
  await exigirEquipe()

  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  const v = parsed.data

  const total = v.distribuicao.reduce((s, d) => s + d.quantidade, 0)
  if (total > 5000) return { ok: false, error: "Máximo de 5000 códigos por lote." }

  const santo = await db.santo.findUnique({ where: { id: v.santoId }, select: { slug: true, nome: true } })
  if (!santo) return { ok: false, error: "Santo não encontrado." }

  // Rótulo do lote (único e legível): slug-do-santo + data/hora.
  const carimbo = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "").slice(2) // YYMMDDHHmm
  const lote = (v.lote ? slugify(v.lote) : `${slugify(santo.slug)}-${carimbo}`).slice(0, 60)

  // Distribuição embaralhada de prêmios.
  const premios: number[] = []
  for (const faixa of v.distribuicao) {
    for (let i = 0; i < faixa.quantidade; i++) premios.push(faixa.descontoPercent)
  }
  for (let i = premios.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[premios[i], premios[j]] = [premios[j], premios[i]]
  }

  try {
    const codigos = await gerarCodigosUnicos(total)
    await db.codigoSorte.createMany({
      data: codigos.map((codigo, i) => ({
        codigo,
        santoId: v.santoId,
        descontoPercent: premios[i],
        lote,
        liberado: v.liberarJa,
      })),
    })
    revalidatePath("/dashboard/sorte")
    return { ok: true, lote, total }
  } catch (e) {
    console.error("Erro ao gerar lote:", e)
    return { ok: false, error: "Não foi possível gerar o lote. Tente novamente." }
  }
}

export async function liberarLote(lote: string): Promise<{ ok: boolean }> {
  await exigirEquipe()
  try {
    await db.codigoSorte.updateMany({ where: { lote }, data: { liberado: true } })
    revalidatePath("/dashboard/sorte")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao liberar lote:", e)
    return { ok: false }
  }
}

export async function bloquearLote(lote: string): Promise<{ ok: boolean }> {
  await exigirEquipe()
  try {
    // Não re-bloqueia códigos já resgatados (o voucher já existe).
    await db.codigoSorte.updateMany({ where: { lote, resgatado: false }, data: { liberado: false } })
    revalidatePath("/dashboard/sorte")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao bloquear lote:", e)
    return { ok: false }
  }
}

export async function exportarLoteCSV(lote: string): Promise<{ ok: true; csv: string; nome: string } | { ok: false }> {
  await exigirEquipe()
  const dados = await obterLoteCodigos(lote)
  if (!dados) return { ok: false }

  const linhas = [
    "codigo;desconto_percent;santo;liberado;resgatado",
    ...dados.codigos.map((c) =>
      [c.codigo, c.descontoPercent, dados.santoNome, c.liberado ? "sim" : "nao", c.resgatado ? "sim" : "nao"].join(";"),
    ),
  ]
  return { ok: true, csv: "﻿" + linhas.join("\r\n"), nome: `codigos-${lote}.csv` }
}
