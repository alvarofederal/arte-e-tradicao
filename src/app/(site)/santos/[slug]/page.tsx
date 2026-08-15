// Página pública de um Santo — /santos/[slug]
// História + data litúrgica + QR próprio (para a embalagem) + CTA para a loja.
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Church, Download, QrCode, ShoppingBag } from "lucide-react"
import { obterSanto, baseUrl } from "../_actions/santos-actions"
import { gerarQrPng } from "@/lib/qr"

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

  const url = `${baseUrl()}/santos/${s.slug}`
  const qr = await gerarQrPng(url)

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
            <Link href="/loja" className="arte-btn arte-btn-primary">
              <ShoppingBag size={17} /> Ver na loja
            </Link>
          </div>
        </div>
      </div>

      {/* QR da embalagem */}
      <div className="arte-card mt-10 flex flex-col items-center gap-5 p-7 sm:flex-row sm:items-center">
        <div style={{ width: 150, height: 150, flexShrink: 0, background: "#fff", padding: 8, border: "1px solid var(--arte-line)", borderRadius: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt={`QR de ${s.nome}`} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="arte-eyebrow"><QrCode size={14} /> QR desta página</span>
          <h3 className="mt-1 text-xl">Para a embalagem do quebra-cabeça</h3>
          <p className="mt-1 text-sm">
            Este QR aponta para esta página. Baixe e use no desenho da embalagem — quem escanear cai aqui,
            na história do Santo.
          </p>
          <code className="mt-2 inline-block text-xs" style={{ color: "var(--arte-ink-soft)", wordBreak: "break-all" }}>{url}</code>
          <div className="mt-4">
            <a href={qr} download={`qr-${s.slug}.png`} className="arte-btn arte-btn-ghost arte-btn-sm">
              <Download size={15} /> Baixar QR (PNG)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
