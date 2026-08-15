import type { Metadata } from "next"
import Link from "next/link"
import { Church, Download, ExternalLink, Info } from "lucide-react"
import { db } from "@/lib/prisma"
import { baseUrl } from "@/app/(site)/santos/_actions/santos-actions"
import { gerarQrPng } from "@/lib/qr"

export const metadata: Metadata = { title: "Santos & QR" }
export const dynamic = "force-dynamic"

export default async function SantosAdminPage() {
  const santos = await db.santo.findMany({
    where: { ativo: true },
    orderBy: { numero: "asc" },
    select: { id: true, numero: true, nome: true, slug: true, _count: { select: { produtos: true } } },
  })

  const base = baseUrl()
  const comQr = await Promise.all(
    santos.map(async (s) => ({
      ...s,
      url: `${base}/santos/${s.slug}`,
      qr: await gerarQrPng(`${base}/santos/${s.slug}`, 512),
    })),
  )

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Church size={14} /> Produção
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">Santos &amp; QR das embalagens</h1>
        <p className="dash-subtitle text-sm">
          Baixe aqui o QR de cada modelo para colocar na arte da embalagem. Ele leva o cliente
          à página pública do Santo (história + data). Uso interno — não aparece no site.
        </p>
      </div>

      <div className="dash-card mb-6 flex items-start gap-3 p-4" style={{ background: "rgba(201,162,75,0.08)" }}>
        <Info size={18} className="mt-0.5 shrink-0" style={{ color: "#A67C2E" }} />
        <p className="dash-title text-sm">
          O QR é <strong>o mesmo para todas as caixas do modelo</strong>. Já o
          <strong> Código da Sorte</strong> (único por caixa) é gerado e impresso à parte, na aba
          <Link href="/dashboard/sorte" className="ml-1 font-semibold" style={{ color: "#A67C2E" }}>Código da Sorte</Link>.
        </p>
      </div>

      {comQr.length === 0 ? (
        <div className="dash-card p-10 text-center">
          <p className="dash-subtitle text-sm">Nenhum Santo cadastrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comQr.map((s) => (
            <div key={s.id} className="dash-card flex items-center gap-4 p-4">
              <div style={{ width: 96, height: 96, flexShrink: 0, background: "#fff", padding: 6, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.qr} alt={`QR de ${s.nome}`} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="dash-title truncate text-sm font-semibold">
                  {s.numero != null && <span style={{ color: "#A67C2E" }}>#{String(s.numero).padStart(3, "0")} </span>}
                  {s.nome}
                </p>
                <p className="dash-muted text-xs">
                  {s._count.produtos > 0 ? `${s._count.produtos} produto(s)` : "sem produto ainda"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a href={s.qr} download={`qr-${s.slug}.png`} className="dash-btn-primary inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                    <Download size={13} /> Baixar QR
                  </a>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="dash-muted inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:opacity-70">
                    <ExternalLink size={13} /> Ver página
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
