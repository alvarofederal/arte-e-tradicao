"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { normalizarCodigo, gerarCodigoVoucher, VALIDADE_VOUCHER_DIAS } from "@/lib/codigo-sorte"

const schema = z.object({ codigo: z.string().min(1, "Digite o código.") })

export type ResgateResult =
  | {
      ok: true
      voucher: { codigo: string; descontoPercent: number; santoExcluidoNome: string; expiraEm: string }
    }
  | { ok: false; error: string }

export async function resgatarCodigo(input: { codigo: string }): Promise<ResgateResult> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: "Faça login para tentar a sorte." }
  const userId = session.user.id

  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }

  const codigo = normalizarCodigo(parsed.data.codigo)
  if (!codigo) return { ok: false, error: "Código inválido. Confira as 16 letras/números da embalagem." }

  const registro = await db.codigoSorte.findUnique({
    where: { codigo },
    include: { santo: { select: { nome: true } } },
  })

  if (!registro) return { ok: false, error: "Código não encontrado. Verifique se digitou corretamente." }
  if (!registro.liberado) return { ok: false, error: "Este código ainda não está ativo. Tente novamente mais tarde." }
  if (registro.resgatado) {
    return {
      ok: false,
      error:
        registro.resgatadoPorId === userId
          ? "Você já resgatou este código. Veja seu voucher abaixo."
          : "Este código já foi utilizado.",
    }
  }

  const expiraEm = new Date()
  expiraEm.setDate(expiraEm.getDate() + VALIDADE_VOUCHER_DIAS)

  try {
    const voucherCodigo = gerarCodigoVoucher()
    await db.$transaction(async (tx) => {
      const voucher = await tx.voucher.create({
        data: {
          codigo: voucherCodigo,
          userId: userId,
          descontoPercent: registro.descontoPercent,
          santoExcluidoId: registro.santoId,
          santoExcluidoNome: registro.santo?.nome ?? "—",
          origemCodigoId: registro.id,
          expiraEm,
        },
      })
      // Marca o código como resgatado — condicionado a AINDA não estar resgatado
      // (evita corrida: dois cliques simultâneos).
      const upd = await tx.codigoSorte.updateMany({
        where: { id: registro.id, resgatado: false },
        data: {
          resgatado: true,
          resgatadoPorId: userId,
          resgatadoEm: new Date(),
          voucherId: voucher.id,
        },
      })
      if (upd.count === 0) throw new Error("JA_RESGATADO")
    })

    revalidatePath("/minha-conta/sorte")
    return {
      ok: true,
      voucher: {
        codigo: voucherCodigo,
        descontoPercent: registro.descontoPercent,
        santoExcluidoNome: registro.santo?.nome ?? "—",
        expiraEm: expiraEm.toISOString(),
      },
    }
  } catch (e) {
    if ((e as Error).message === "JA_RESGATADO") {
      return { ok: false, error: "Este código acabou de ser utilizado." }
    }
    console.error("Erro ao resgatar código:", e)
    return { ok: false, error: "Não foi possível resgatar agora. Tente novamente." }
  }
}
