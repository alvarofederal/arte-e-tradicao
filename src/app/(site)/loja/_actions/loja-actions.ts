// Leitura pública da loja (importado por Server Components — sem "use server").
import { db } from "@/lib/prisma"

export interface ProdutoLoja {
  id: string
  sku: string
  nome: string
  slug: string
  descricao: string
  precoCentavos: number
  estoque: number
  imagem: string | null // produto ou, se vazio, imagem do Santo
  categoriaNome: string | null
  santoSlug: string | null
  santoNome: string | null
}

export interface CategoriaLoja {
  slug: string
  nome: string
}

function imagemDe(p: { imagem: string | null; santo: { imagem: string | null } | null }): string | null {
  return p.imagem || p.santo?.imagem || null
}

export async function listarCategoriasLoja(): Promise<CategoriaLoja[]> {
  const cats = await db.categoria.findMany({
    where: { ativo: true, produtos: { some: { ativo: true } } },
    orderBy: [{ ordem: "asc" }, { nome: "asc" }],
    select: { slug: true, nome: true },
  })
  return cats
}

export async function listarProdutosLoja(categoriaSlug?: string): Promise<ProdutoLoja[]> {
  const prods = await db.produto.findMany({
    where: {
      ativo: true,
      ...(categoriaSlug ? { categoria: { slug: categoriaSlug } } : {}),
    },
    orderBy: { criadoEm: "desc" },
    include: {
      categoria: { select: { nome: true } },
      santo: { select: { imagem: true, slug: true, nome: true } },
    },
  })
  return prods.map((p) => ({
    id: p.id, sku: p.sku, nome: p.nome, slug: p.slug, descricao: p.descricao ?? "",
    precoCentavos: p.precoCentavos, estoque: p.estoque,
    imagem: imagemDe(p),
    categoriaNome: p.categoria?.nome ?? null,
    santoSlug: p.santo?.slug ?? null,
    santoNome: p.santo?.nome ?? null,
  }))
}

export async function listarProdutosDoSanto(santoSlug: string): Promise<ProdutoLoja[]> {
  const prods = await db.produto.findMany({
    where: { ativo: true, santo: { slug: santoSlug } },
    orderBy: { criadoEm: "desc" },
    include: { categoria: { select: { nome: true } }, santo: { select: { imagem: true, slug: true, nome: true } } },
  })
  return prods.map((p) => ({
    id: p.id, sku: p.sku, nome: p.nome, slug: p.slug, descricao: p.descricao ?? "",
    precoCentavos: p.precoCentavos, estoque: p.estoque, imagem: imagemDe(p),
    categoriaNome: p.categoria?.nome ?? null, santoSlug: p.santo?.slug ?? null, santoNome: p.santo?.nome ?? null,
  }))
}

export async function obterProdutoLoja(slug: string): Promise<ProdutoLoja | null> {
  const p = await db.produto.findUnique({
    where: { slug },
    include: {
      categoria: { select: { nome: true } },
      santo: { select: { imagem: true, slug: true, nome: true } },
    },
  })
  if (!p || !p.ativo) return null
  return {
    id: p.id, sku: p.sku, nome: p.nome, slug: p.slug, descricao: p.descricao ?? "",
    precoCentavos: p.precoCentavos, estoque: p.estoque,
    imagem: imagemDe(p),
    categoriaNome: p.categoria?.nome ?? null,
    santoSlug: p.santo?.slug ?? null,
    santoNome: p.santo?.nome ?? null,
  }
}
