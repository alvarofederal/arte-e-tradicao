"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { PedidoStatus } from "@/generated/prisma"

async function exigirEquipe() {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/pedidos")
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "LOJISTA") {
    redirect("/minha-conta")
  }
  return session.user
}

export type StatusResult = { ok: true } | { ok: false; error: string }

async function definirStatus(id: string, status: PedidoStatus): Promise<StatusResult> {
  await exigirEquipe()

  const pedido = await db.pedido.findUnique({
    where: { id },
    select: { status: true, itens: { select: { produtoId: true, qtd: true } } },
  })
  if (!pedido) return { ok: false, error: "Pedido não encontrado." }
  if (pedido.status === status) return { ok: true }

  const saiDeCancelado = pedido.status === "CANCELADO"
  const vaiParaCancelado = status === "CANCELADO"

  const data: {
    status: PedidoStatus
    pagoEm?: Date | null
    enviadoEm?: Date | null
    canceladoEm?: Date | null
  } = { status }

  if (status === "PAGO") data.pagoEm = new Date()
  if (status === "ENVIADO") data.enviadoEm = new Date()
  if (status === "CANCELADO") data.canceladoEm = new Date()
  if (status === "AGUARDANDO_PAGAMENTO") {
    data.pagoEm = null
    data.enviadoEm = null
    data.canceladoEm = null
  }

  try {
    await db.$transaction(async (tx) => {
      // Cancelar → devolve o estoque reservado no pedido.
      if (vaiParaCancelado && !saiDeCancelado) {
        for (const it of pedido.itens) {
          if (it.produtoId) {
            await tx.produto.updateMany({ where: { id: it.produtoId }, data: { estoque: { increment: it.qtd } } })
          }
        }
      }
      // Reabrir um pedido cancelado → baixa o estoque de novo (com checagem).
      if (saiDeCancelado && !vaiParaCancelado) {
        for (const it of pedido.itens) {
          if (it.produtoId) {
            const upd = await tx.produto.updateMany({
              where: { id: it.produtoId, estoque: { gte: it.qtd } },
              data: { estoque: { decrement: it.qtd } },
            })
            if (upd.count === 0) throw new Error("ESTOQUE")
          }
        }
      }
      await tx.pedido.update({ where: { id }, data })
    })
  } catch (e) {
    if ((e as Error).message === "ESTOQUE") {
      return { ok: false, error: "Não há estoque suficiente para reabrir este pedido." }
    }
    console.error("Erro ao atualizar status:", e)
    return { ok: false, error: "Não foi possível atualizar o pedido." }
  }

  revalidatePath("/dashboard/pedidos")
  revalidatePath(`/dashboard/pedidos/${id}`)
  return { ok: true }
}

export async function marcarPago(id: string) {
  return definirStatus(id, "PAGO")
}
export async function marcarEnviado(id: string) {
  return definirStatus(id, "ENVIADO")
}
export async function cancelarPedido(id: string) {
  return definirStatus(id, "CANCELADO")
}
export async function reabrirPedido(id: string) {
  return definirStatus(id, "AGUARDANDO_PAGAMENTO")
}
