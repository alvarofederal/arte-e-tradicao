"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export interface CategoriaRegistro {
  id: string
  nome: string
  slug: string
  ordem: number
  ativo: boolean
  qtdProdutos: number
}

async function exigirAdmin() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session.user
}

const schema = z.object({
  id: z.string().nullish(),
  nome: z.string().trim().min(1, "Informe o nome").max(80),
  ordem: z.number().int().min(0).max(9999).default(0),
  ativo: z.boolean().default(true),
})

export async function listarCategorias(): Promise<CategoriaRegistro[]> {
  await exigirAdmin()
  const cats = await db.categoria.findMany({
    orderBy: [{ ordem: "asc" }, { nome: "asc" }],
    include: { _count: { select: { produtos: true } } },
  })
  return cats.map((c) => ({
    id: c.id, nome: c.nome, slug: c.slug, ordem: c.ordem, ativo: c.ativo,
    qtdProdutos: c._count.produtos,
  }))
}

export async function salvarCategoria(
  input: z.input<typeof schema>
): Promise<{ ok: true } | { ok: false; error: string }> {
  await exigirAdmin()
  const p = schema.safeParse(input)
  if (!p.success) return { ok: false, error: p.error.issues[0]?.message ?? "Dados inválidos" }
  const v = p.data
  const slug = slugify(v.nome)

  try {
    if (v.id) {
      await db.categoria.update({ where: { id: v.id }, data: { nome: v.nome, slug, ordem: v.ordem, ativo: v.ativo } })
    } else {
      await db.categoria.create({ data: { nome: v.nome, slug, ordem: v.ordem, ativo: v.ativo } })
    }
    revalidatePath("/dashboard/categorias")
    return { ok: true }
  } catch (e) {
    if ((e as { code?: string })?.code === "P2002") return { ok: false, error: "Já existe uma categoria com esse nome." }
    console.error("Erro ao salvar categoria:", e)
    return { ok: false, error: "Não foi possível salvar." }
  }
}

export async function excluirCategoria(id: string): Promise<{ ok: boolean; error?: string }> {
  await exigirAdmin()
  const emUso = await db.produto.count({ where: { categoriaId: id } })
  if (emUso > 0) return { ok: false, error: `Há ${emUso} produto(s) nesta categoria. Mova-os antes de excluir.` }
  try {
    await db.categoria.delete({ where: { id } })
    revalidatePath("/dashboard/categorias")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao excluir categoria:", e)
    return { ok: false, error: "Não foi possível excluir." }
  }
}
