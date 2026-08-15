// Vitrine da loja — lê os produtos do banco.
import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, Package } from "lucide-react"
import { listarProdutosLoja, listarCategoriasLoja } from "./_actions/loja-actions"
import { formatBRL } from "@/lib/money"

export const metadata: Metadata = {
  title: "Loja",
  description: "Quebra-cabeças dos Santos — arte sacra artesanal para montar e colecionar.",
}

export const dynamic = "force-dynamic"

export default async function Loja({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams
  const [produtos, categorias] = await Promise.all([listarProdutosLoja(cat), listarCategoriasLoja()])

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      <header className="mt-6 text-center">
        <span className="arte-eyebrow"><ShoppingBag size={14} /> Loja Arte &amp; Tradição</span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Nossos produtos</h1>
        <p className="mx-auto mt-3 max-w-xl">Quebra-cabeças dos Santos, artesanais, para montar e colecionar.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[210px_1fr] lg:items-start">
        {/* Menu lateral de categorias */}
        {categorias.length > 0 && (
          <aside className="lg:sticky lg:top-24">
            <span className="arte-eyebrow hidden lg:inline-flex">Categorias</span>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              <CatLink href="/loja" ativo={!cat}>Tudo</CatLink>
              {categorias.map((c) => (
                <CatLink key={c.slug} href={`/loja?cat=${c.slug}`} ativo={cat === c.slug}>
                  {c.nome}
                </CatLink>
              ))}
            </nav>
          </aside>
        )}

        {/* Grade de produtos */}
        <div className={categorias.length > 0 ? "" : "lg:col-span-2"}>
          {produtos.length === 0 ? (
            <div className="arte-card mx-auto max-w-md p-10 text-center">
              <span className="arte-ic arte-ic-gold mx-auto"><Package size={26} /></span>
              <h3 className="mt-4 text-xl">Em breve novos produtos</h3>
              <p className="mt-2 text-sm">Estamos preparando a coleção. Volte logo!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.map((p) => (
                <Link key={p.id} href={`/loja/${p.slug}`} className="arte-card group overflow-hidden">
                  <div className="grid aspect-square place-items-center overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(228,203,144,0.25), rgba(169,193,217,0.15))" }}>
                    {p.imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagem} alt={p.nome} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Package size={44} style={{ color: "var(--arte-gold-deep)", opacity: 0.5 }} />
                    )}
                  </div>
                  <div className="p-5">
                    {p.categoriaNome && <span className="arte-eyebrow text-[0.62rem]">{p.categoriaNome}</span>}
                    <h3 className="mt-1 text-lg leading-snug">{p.nome}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(p.precoCentavos)}</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--arte-gold-deep)" }}>Ver →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CatLink({ href, ativo, children }: { href: string; ativo: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors lg:w-full"
      style={ativo
        ? { background: "var(--arte-gold-deep)", color: "#fff" }
        : { background: "rgba(255,255,255,0.5)", color: "var(--arte-ink)", border: "1px solid var(--arte-line)" }}
    >
      {children}
    </Link>
  )
}
