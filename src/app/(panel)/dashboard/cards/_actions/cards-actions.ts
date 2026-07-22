"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { CardRegistro, SalvarCardInput } from "./cards-shared"

/* ─── Validação (Zod — regra do projeto) ─── */
const estiloSchema = z.object({
  frenteBg: z.string(),
  frenteBg2: z.string(),
  usarGradiente: z.boolean(),
  faixaCor: z.string(),
  nomeCor: z.string(),
  subtituloCor: z.string(),
  brilho: z.boolean(),
  holografico: z.boolean(),
  bordaEstilo: z.enum(["nenhuma", "solida", "dupla", "classica"]),
  bordaCor: z.string(),
  bordaLargura: z.number().min(0).max(40),
  versoBg: z.string(),
  versoTextoCor: z.string(),
  acento: z.string(),
  imgScale: z.number().min(0.2).max(5).default(1),
  imgPosX: z.number().min(0).max(100).default(50),
  imgPosY: z.number().min(0).max(100).default(50),
})

const salvarSchema = z.object({
  id: z.string().nullish(),
  numero: z.string().trim().max(12).default(""),
  nome: z.string().trim().min(1, "Informe o nome do Santo").max(120),
  dataFesta: z.string().trim().max(12).default(""),
  descricao: z.string().max(4000).default(""),
  imagem: z.string().max(8_000_000).nullable().default(null), // dataURL
  estilo: estiloSchema,
})

async function exigirUsuario() {
  const session = await auth()
  if (!session?.user) redirect("/login") // sessão ausente/expirada → login (não quebra a página)
  return session.user
}

function toRegistro(c: {
  id: string
  numero: string | null
  nome: string
  dataFesta: string | null
  descricao: string | null
  imagem: string | null
  estilo: unknown
  atualizadoEm: Date
}): CardRegistro {
  return {
    id: c.id,
    numero: c.numero ?? "",
    nome: c.nome,
    dataFesta: c.dataFesta ?? "",
    descricao: c.descricao ?? "",
    imagem: c.imagem ?? null,
    estilo: c.estilo as CardRegistro["estilo"],
    atualizadoEm: c.atualizadoEm.toISOString(),
  }
}

export async function listarCards(): Promise<CardRegistro[]> {
  await exigirUsuario()
  const cards = await db.cardSanto.findMany({ orderBy: { atualizadoEm: "desc" } })
  return cards.map(toRegistro)
}

export async function obterCard(id: string): Promise<CardRegistro | null> {
  await exigirUsuario()
  const card = await db.cardSanto.findUnique({ where: { id } })
  return card ? toRegistro(card) : null
}

export async function salvarCard(
  input: SalvarCardInput
): Promise<{ ok: true; card: CardRegistro } | { ok: false; error: string }> {
  const user = await exigirUsuario()

  const parsed = salvarSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }
  const v = parsed.data

  const data = {
    numero: v.numero || null,
    nome: v.nome,
    dataFesta: v.dataFesta || null,
    descricao: v.descricao || null,
    imagem: v.imagem || null,
    estilo: v.estilo,
  }

  try {
    const card = v.id
      ? await db.cardSanto.update({ where: { id: v.id }, data })
      : await db.cardSanto.create({ data: { ...data, criadoPorId: user.id } })
    revalidatePath("/dashboard/cards")
    return { ok: true, card: toRegistro(card) }
  } catch (e) {
    console.error("Erro ao salvar card:", e)
    return { ok: false, error: "Não foi possível salvar o card." }
  }
}

export async function excluirCard(id: string): Promise<{ ok: boolean }> {
  await exigirUsuario()
  try {
    await db.cardSanto.delete({ where: { id } })
    revalidatePath("/dashboard/cards")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao excluir card:", e)
    return { ok: false }
  }
}
