"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export interface ProdutoRegistro {
  id: string
  sku: string
  nome: string
  slug: string
  descricao: string
  precoCentavos: number
  estoque: number
  imagem: string | null
  ativo: boolean
  santoId: string | null
  santoNome: string | null
  categoriaId: string | null
  categoriaNome: string | null
}

export interface OpcoesForm {
  santos: { id: string; nome: string; numero: number | null }[]
  categorias: { id: string; nome: string }[]
}

async function exigirAdmin() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session.user
}

const schema = z.object({
  id: z.string().nullish(),
  sku: z.string().trim().min(1, "Informe o SKU").max(40),
  nome: z.string().trim().min(1, "Informe o nome").max(140),
  descricao: z.string().max(4000).default(""),
  precoCentavos: z.number().int().min(0).max(100_000_00),
  estoque: z.number().int().min(0).max(1_000_000).default(0),
  imagem: z.string().max(8_000_000).nullable().default(null),
  ativo: z.boolean().default(true),
  santoId: z.string().nullish(),
  categoriaId: z.string().nullish(),
})

async function slugLivre(nome: string, ignorarId?: string | null): Promise<string> {
  const base = slugify(nome) || "produto"
  let slug = base
  let i = 2
  while (true) {
    const existe = await db.produto.findUnique({ where: { slug } })
    if (!existe || existe.id === ignorarId) return slug
    slug = `${base}-${i++}`
  }
}

function toRegistro(p: {
  id: string; sku: string; nome: string; slug: string; descricao: string | null
  precoCentavos: number; estoque: number; imagem: string | null; ativo: boolean
  santoId: string | null; categoriaId: string | null
  santo?: { nome: string } | null; categoria?: { nome: string } | null
}): ProdutoRegistro {
  return {
    id: p.id, sku: p.sku, nome: p.nome, slug: p.slug, descricao: p.descricao ?? "",
    precoCentavos: p.precoCentavos, estoque: p.estoque, imagem: p.imagem, ativo: p.ativo,
    santoId: p.santoId, santoNome: p.santo?.nome ?? null,
    categoriaId: p.categoriaId, categoriaNome: p.categoria?.nome ?? null,
  }
}

export async function listarProdutos(): Promise<ProdutoRegistro[]> {
  await exigirAdmin()
  const prods = await db.produto.findMany({
    orderBy: { criadoEm: "desc" },
    include: { santo: { select: { nome: true } }, categoria: { select: { nome: true } } },
  })
  return prods.map(toRegistro)
}

export async function obterProduto(id: string): Promise<ProdutoRegistro | null> {
  await exigirAdmin()
  const p = await db.produto.findUnique({
    where: { id },
    include: { santo: { select: { nome: true } }, categoria: { select: { nome: true } } },
  })
  return p ? toRegistro(p) : null
}

export async function opcoesFormulario(): Promise<OpcoesForm> {
  await exigirAdmin()
  const [santos, categorias] = await Promise.all([
    db.santo.findMany({ where: { ativo: true }, orderBy: { numero: "asc" }, select: { id: true, nome: true, numero: true } }),
    db.categoria.findMany({ where: { ativo: true }, orderBy: [{ ordem: "asc" }, { nome: "asc" }], select: { id: true, nome: true } }),
  ])
  return { santos, categorias }
}

export async function salvarProduto(
  input: z.input<typeof schema>
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  await exigirAdmin()
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  const v = parsed.data
  const slug = await slugLivre(v.nome, v.id)

  const data = {
    sku: v.sku,
    nome: v.nome,
    slug,
    descricao: v.descricao || null,
    precoCentavos: v.precoCentavos,
    estoque: v.estoque,
    imagem: v.imagem || null,
    ativo: v.ativo,
    santoId: v.santoId || null,
    categoriaId: v.categoriaId || null,
  }

  try {
    const p = v.id
      ? await db.produto.update({ where: { id: v.id }, data })
      : await db.produto.create({ data })
    revalidatePath("/dashboard/produtos")
    return { ok: true, id: p.id }
  } catch (e) {
    if ((e as { code?: string })?.code === "P2002") return { ok: false, error: "Já existe um produto com esse SKU." }
    console.error("Erro ao salvar produto:", e)
    return { ok: false, error: "Não foi possível salvar o produto." }
  }
}

export async function excluirProduto(id: string): Promise<{ ok: boolean }> {
  await exigirAdmin()
  try {
    await db.produto.delete({ where: { id } })
    revalidatePath("/dashboard/produtos")
    return { ok: true }
  } catch (e) {
    console.error("Erro ao excluir produto:", e)
    return { ok: false }
  }
}
