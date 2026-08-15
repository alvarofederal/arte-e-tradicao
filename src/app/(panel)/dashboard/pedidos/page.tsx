import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag, Inbox } from "lucide-react"
import { listarPedidosAdmin, contarPedidosPorStatus, STATUS_LABEL, STATUS_COR } from "@/lib/pedidos"
import type { PedidoStatus } from "@/generated/prisma"

export const metadata: Metadata = { title: "Pedidos" }
export const dynamic = "force-dynamic"

function reais(c: number) { return "R$ " + (c / 100).toFixed(2).replace(".", ",") }
function dataBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d)
}

const STATUS_ORDER: PedidoStatus[] = ["AGUARDANDO_PAGAMENTO", "PAGO", "ENVIADO", "CANCELADO"]

export default async function PedidosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const filtro = STATUS_ORDER.includes(status as PedidoStatus) ? (status as PedidoStatus) : undefined

  const [pedidos, contagem] = await Promise.all([
    listarPedidosAdmin(filtro),
    contarPedidosPorStatus(),
  ])
  const total = Object.values(contagem).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <ShoppingBag size={14} /> Loja
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">Pedidos</h1>
        <p className="dash-subtitle text-sm">
          {total === 0 ? "Nenhum pedido ainda." : `${total} pedido${total > 1 ? "s" : ""} no total.`}
        </p>
      </div>

      {/* Filtros por status */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FiltroChip label="Todos" href="/dashboard/pedidos" ativo={!filtro} count={total} />
        {STATUS_ORDER.map((s) => (
          <FiltroChip
            key={s}
            label={STATUS_LABEL[s]}
            href={`/dashboard/pedidos?status=${s}`}
            ativo={filtro === s}
            count={contagem[s] ?? 0}
            cor={STATUS_COR[s]}
          />
        ))}
      </div>

      {pedidos.length === 0 ? (
        <div className="dash-card flex flex-col items-center gap-3 p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
            <Inbox size={26} />
          </span>
          <h3 className="dash-title text-lg font-semibold">Nada por aqui</h3>
          <p className="dash-subtitle max-w-sm text-sm">Os pedidos feitos na loja aparecem aqui para você confirmar o pagamento e o envio.</p>
        </div>
      ) : (
        <div className="dash-card overflow-hidden">
          <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            {pedidos.map((p) => {
              const cor = STATUS_COR[p.status]
              return (
                <Link key={p.id} href={`/dashboard/pedidos/${p.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02]">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="dash-title text-sm font-bold">#{p.numero}</span>
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: cor.bg, color: cor.fg }}>{STATUS_LABEL[p.status]}</span>
                    </div>
                    <p className="dash-muted truncate text-xs">{p.clienteNome} · {dataBR(p.criadoEm)}</p>
                  </div>
                  <div className="text-right">
                    <p className="dash-title text-sm font-bold" style={{ color: "#A67C2E" }}>{reais(p.totalCentavos)}</p>
                    <p className="dash-muted text-xs">{p.quantidadeItens} item(ns)</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function FiltroChip({ label, href, ativo, count, cor }: {
  label: string; href: string; ativo: boolean; count: number
  cor?: { bg: string; fg: string }
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
      style={ativo
        ? { background: "#A67C2E", color: "#fff" }
        : cor
          ? { background: cor.bg, color: cor.fg }
          : { background: "rgba(0,0,0,0.05)", color: "#666" }}
    >
      {label} <span style={{ opacity: 0.75 }}>({count})</span>
    </Link>
  )
}
