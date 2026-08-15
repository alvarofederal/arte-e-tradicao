import { db } from "@/lib/prisma"

export interface SantoResumo {
  numero: number | null
  nome: string
  slug: string
  dataFesta: string
  imagem: string | null
  bordaCor: string
}

export interface SantoDetalhe extends SantoResumo {
  historia: string
  oracao: string
}

/** URL pública base (para os QR codes das embalagens).
 *  O QR vai IMPRESSO na caixa — nunca pode apontar para localhost.
 *  Prioriza NEXT_PUBLIC_SITE_URL (domínio próprio); ignora valores locais. */
const URL_PRODUCAO = "https://arteetradicao.vercel.app"
export function baseUrl(): string {
  const cand = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || ""
  if (cand && !/localhost|127\.0\.0\.1/.test(cand)) return cand.replace(/\/+$/, "")
  return URL_PRODUCAO
}

export async function listarSantos(): Promise<SantoResumo[]> {
  const santos = await db.santo.findMany({
    where: { ativo: true },
    orderBy: { numero: "asc" },
    select: { numero: true, nome: true, slug: true, dataFesta: true, imagem: true, bordaCor: true },
  })
  return santos.map((s) => ({
    numero: s.numero,
    nome: s.nome,
    slug: s.slug,
    dataFesta: s.dataFesta ?? "",
    imagem: s.imagem,
    bordaCor: s.bordaCor ?? "#C9A24B",
  }))
}

export async function obterSanto(slug: string): Promise<SantoDetalhe | null> {
  const s = await db.santo.findUnique({ where: { slug } })
  if (!s || !s.ativo) return null
  return {
    numero: s.numero,
    nome: s.nome,
    slug: s.slug,
    dataFesta: s.dataFesta ?? "",
    imagem: s.imagem,
    bordaCor: s.bordaCor ?? "#C9A24B",
    historia: s.historia ?? "",
    oracao: s.oracao ?? "",
  }
}

/** Todos os slugs — para generateStaticParams das páginas de Santo. */
export async function listarSlugs(): Promise<string[]> {
  const santos = await db.santo.findMany({ where: { ativo: true }, select: { slug: true } })
  return santos.map((s) => s.slug)
}
