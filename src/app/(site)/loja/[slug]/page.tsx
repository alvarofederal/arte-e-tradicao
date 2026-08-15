import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, Church } from "lucide-react"
import { obterProdutoLoja } from "../_actions/loja-actions"
import { formatBRL } from "@/lib/money"
import { AddToCart } from "../../_components/cart/add-to-cart"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await obterProdutoLoja(slug)
  if (!p) return { title: "Produto não encontrado" }
  return {
    title: p.nome,
    description: p.descricao || `${p.nome} — quebra-cabeça artesanal dos Santos.`,
    openGraph: { title: `${p.nome} — Arte & Tradição`, description: p.descricao?.slice(0, 155) },
  }
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await obterProdutoLoja(slug)
  if (!p) notFound()

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/loja" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Voltar à loja
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* Foto */}
        <div className="arte-card grid aspect-square place-items-center overflow-hidden p-0" style={{ background: "linear-gradient(160deg, rgba(228,203,144,0.25), rgba(169,193,217,0.15))" }}>
          {p.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.imagem} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Package size={64} style={{ color: "var(--arte-gold-deep)", opacity: 0.5 }} />
          )}
        </div>

        {/* Info */}
        <div>
          {p.categoriaNome && <span className="arte-eyebrow">{p.categoriaNome}</span>}
          <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{p.nome}</h1>
          <p className="mt-3 text-3xl font-bold" style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(p.precoCentavos)}</p>

          {p.descricao && <p className="mt-4 leading-relaxed">{p.descricao}</p>}

          <p className="mt-3 text-sm" style={{ color: "var(--arte-ink-soft)" }}>
            {p.estoque > 0 ? `${p.estoque} em estoque` : "Esgotado"}
          </p>

          <AddToCart
            item={{ produtoId: p.id, sku: p.sku, nome: p.nome, slug: p.slug, precoCentavos: p.precoCentavos, imagem: p.imagem }}
            estoque={p.estoque}
          />

          {p.santoSlug && (
            <Link href={`/santos/${p.santoSlug}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--arte-gold-deep)" }}>
              <Church size={15} /> Conheça a história de {p.santoNome}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
