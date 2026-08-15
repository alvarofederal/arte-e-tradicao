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

async function definirStatus(id: string, status: PedidoStatus) {
  await exigirEquipe()
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

  await db.pedido.update({ where: { id }, data })
  revalidatePath("/dashboard/pedidos")
  revalidatePath(`/dashboard/pedidos/${id}`)
  return { ok: true as const }
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
