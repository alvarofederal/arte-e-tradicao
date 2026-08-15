// Página pública de um Santo — /santos/[slug]
// História + data litúrgica + QR próprio (para a embalagem) + CTA para a loja.
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Church, ShoppingBag } from "lucide-react"
import { obterSanto, baseUrl } from "../_actions/santos-actions"
import { listarProdutosDoSanto } from "../../loja/_actions/loja-actions"
import { formatBRL } from "@/lib/money"

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = await obterSanto(slug)
  if (!s) return { title: "Santo não encontrado" }
  const desc = (s.historia || `Conheça a história de ${s.nome} e o quebra-cabeça da coleção Arte & Tradição.`).slice(0, 155)
  const url = `${baseUrl()}/santos/${s.slug}`
  return {
    title: s.nome,
    description: desc,
    openGraph: { title: `${s.nome} — Arte & Tradição`, description: desc, url, type: "article" },
  }
}

export default async function SantoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await obterSanto(slug)
  if (!s) notFound()

  const produtos = await listarProdutosDoSanto(s.slug)

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/santos" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Todos os Santos
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
        {/* Imagem */}
        <div>
          <div style={{ aspectRatio: "49 / 65", border: `6px solid ${s.bordaCor}`, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6), 0 18px 40px -20px rgba(59,50,46,0.4)", overflow: "hidden", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
            {s.imagem ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.imagem} alt={s.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Church size={56} style={{ color: s.bordaCor, opacity: 0.5 }} />
            )}
          </div>
        </div>

        {/* Texto */}
        <div>
          {s.numero != null && (
            <span className="arte-eyebrow">Nº {String(s.numero).padStart(3, "0")}</span>
          )}
          <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">{s.nome}</h1>
          {s.dataFesta && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--arte-gold-deep)" }}>
              <Church size={15} /> {s.dataFesta}
            </p>
          )}

          <hr className="arte-rule my-6" />

          {s.historia ? (
            <p className="text-lg leading-relaxed">{s.historia}</p>
          ) : (
            <p className="italic" style={{ color: "var(--arte-ink-soft)" }}>História em breve.</p>
          )}

          {s.oracao && (
            <div className="arte-card mt-6 p-5">
              <span className="arte-eyebrow">Oração</span>
              <p className="mt-2 whitespace-pre-line">{s.oracao}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {produtos.length > 0 ? (
              <Link href={`/loja/${produtos[0].slug}`} className="arte-btn arte-btn-primary">
                <ShoppingBag size={17} /> Comprar o quebra-cabeça
              </Link>
            ) : (
              <Link href="/loja" className="arte-btn arte-btn-ghost">
                <ShoppingBag size={17} /> Ver a loja
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Produtos deste Santo */}
      {produtos.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl sm:text-3xl">Quebra-cabeça{produtos.length > 1 ? "s" : ""} deste Santo</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((p) => (
              <Link key={p.id} href={`/loja/${p.slug}`} className="arte-card group overflow-hidden">
                <div className="grid aspect-square place-items-center overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(228,203,144,0.25), rgba(169,193,217,0.15))" }}>
                  {p.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagem} alt={p.nome} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <ShoppingBag size={40} style={{ color: "var(--arte-gold-deep)", opacity: 0.5 }} />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg leading-snug">{p.nome}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(p.precoCentavos)}</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--arte-gold-deep)" }}>Ver →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
