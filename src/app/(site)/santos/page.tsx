// Índice público dos Santos — /santos (galeria navegável, SEO).
import type { Metadata } from "next"
import Link from "next/link"
import { Cross, ArrowLeft, Sparkles } from "lucide-react"
import { listarSantos } from "./_actions/santos-actions"
import vitrine from "@/data/vitrine.json"

export const metadata: Metadata = {
  title: "Santos",
  description: "Conheça os Santos da coleção Arte & Tradição — a história, a data litúrgica e o quebra-cabeça de cada um.",
}

export const revalidate = 3600

// miniaturas leves (estáticas) por número — geradas por scripts/gerar-vitrine.ts
const thumbs = new Map((vitrine as { numero: number; arquivo: string }[]).map((v) => [v.numero, v.arquivo]))

export default async function SantosPage() {
  const santos = await listarSantos()

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      <header className="mt-6 text-center">
        <span className="arte-eyebrow"><Sparkles size={14} /> Coleção</span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Os Santos</h1>
        <p className="mx-auto mt-3 max-w-xl">
          {santos.length} Santos na coleção. Toque em um para conhecer a história e o quebra-cabeça.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {santos.map((s) => {
          const thumb = s.numero != null ? thumbs.get(s.numero) : undefined
          return (
            <Link key={s.slug} href={`/santos/${s.slug}`} className="arte-card group overflow-hidden p-2" title={s.nome}>
              <div style={{ aspectRatio: "49 / 65", border: `2.5px solid ${s.bordaCor}`, background: "#F5ECD6", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
                {s.numero != null && (
                  <span style={{ position: "absolute", top: 4, right: 4, zIndex: 2, width: 18, height: 18, borderRadius: "50%", background: "#F6EFDD", border: "1px solid #C9A24B", display: "grid", placeItems: "center", fontFamily: "var(--font-arte-serif), serif", fontSize: 8, fontWeight: 700, color: "#3B322E" }}>
                    {String(s.numero).padStart(3, "0")}
                  </span>
                )}
                <div style={{ flex: 1, display: "grid", placeItems: "center", overflow: "hidden" }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={s.nome} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Cross size={22} style={{ color: s.bordaCor, opacity: 0.6 }} />
                  )}
                </div>
                <div style={{ background: "#F5ECD6", borderTop: `1px solid ${s.bordaCor}`, padding: "3px 4px", textAlign: "center" }}>
                  <span style={{ display: "block", fontFamily: "var(--font-arte-serif), serif", fontSize: 8.5, fontWeight: 700, lineHeight: 1.1, color: "#2E2A26", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.nome}
                  </span>
                </div>
              </div>
              {s.dataFesta && <p className="dash-muted mt-1.5 text-center text-[11px]" style={{ color: "var(--arte-ink-soft)" }}>{s.dataFesta}</p>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
