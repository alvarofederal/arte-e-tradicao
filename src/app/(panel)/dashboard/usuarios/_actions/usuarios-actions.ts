"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { Role } from "@/generated/prisma"

async function exigirSuperAdmin() {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/usuarios")
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard")
  return session.user
}

export interface UsuarioRegistro {
  id: string
  nome: string | null
  email: string
  role: Role
  ativo: boolean
  verificado: boolean
  temSenha: boolean
  temGoogle: boolean
  totalPedidos: number
  ultimoAcesso: Date | null
  criadoEm: Date
}

export async function listarUsuarios(): Promise<UsuarioRegistro[]> {
  await exigirSuperAdmin()
  const users = await db.user.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      accounts: { select: { provider: true } },
      _count: { select: { pedidos: true } },
    },
  })
  return users.map((u) => ({
    id: u.id,
    nome: u.name,
    email: u.email,
    role: u.role,
    ativo: u.ativo,
    verificado: u.emailVerified != null,
    temSenha: !!u.password,
    temGoogle: u.accounts.some((a) => a.provider === "google"),
    totalPedidos: u._count.pedidos,
    ultimoAcesso: u.ultimoAcesso,
    criadoEm: u.criadoEm,
  }))
}

const roleSchema = z.enum(["SUPER_ADMIN", "LOJISTA", "CLIENTE"])

export async function alterarRole(id: string, role: string): Promise<{ ok: boolean; error?: string }> {
  const eu = await exigirSuperAdmin()
  if (id === eu.id) return { ok: false, error: "Você não pode alterar seu próprio nível." }
  const parsed = roleSchema.safeParse(role)
  if (!parsed.success) return { ok: false, error: "Nível inválido." }
  try {
    await db.user.update({ where: { id }, data: { role: parsed.data } })
    revalidatePath("/dashboard/usuarios")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao alterar nível:", e)
    return { ok: false, error: "Não foi possível alterar o nível." }
  }
}

export async function alternarAtivo(id: string): Promise<{ ok: boolean; error?: string }> {
  const eu = await exigirSuperAdmin()
  if (id === eu.id) return { ok: false, error: "Você não pode desativar a si mesmo." }
  try {
    const u = await db.user.findUnique({ where: { id }, select: { ativo: true } })
    if (!u) return { ok: false, error: "Usuário não encontrado." }
    await db.user.update({ where: { id }, data: { ativo: !u.ativo } })
    revalidatePath("/dashboard/usuarios")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao alternar ativo:", e)
    return { ok: false, error: "Não foi possível atualizar." }
  }
}
