import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, User } from "lucide-react"
import { obterPedidoAdmin, STATUS_LABEL, STATUS_COR } from "@/lib/pedidos"
import { PedidoAcoes } from "../_components/pedido-acoes"

export const metadata: Metadata = { title: "Pedido" }
export const dynamic = "force-dynamic"

function reais(c: number) { return "R$ " + (c / 100).toFixed(2).replace(".", ",") }
function dataHora(d: Date | null) {
  if (!d) return "—"
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d)
}

export default async function PedidoAdminDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pedido = await obterPedidoAdmin(id)
  if (!pedido) notFound()

  const cor = STATUS_COR[pedido.status]

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/pedidos" className="dash-muted inline-flex items-center gap-1.5 text-sm hover:opacity-70">
        <ArrowLeft size={15} /> Todos os pedidos
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="dash-title text-2xl font-bold">Pedido #{pedido.numero}</h1>
          <p className="dash-muted text-sm">Feito em {dataHora(pedido.criadoEm)}</p>
        </div>
        <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: cor.bg, color: cor.fg }}>{STATUS_LABEL[pedido.status]}</span>
      </div>

      {/* Ações */}
      <div className="dash-card mt-5 p-5">
        <p className="dash-muted mb-3 text-xs font-semibold uppercase tracking-wider">Ações</p>
        <PedidoAcoes id={pedido.id} status={pedido.status} />
        <div className="dash-muted mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          <span>Pago em: {dataHora(pedido.pagoEm)}</span>
          <span>Enviado em: {dataHora(pedido.enviadoEm)}</span>
          <span>Cancelado em: {dataHora(pedido.canceladoEm)}</span>
        </div>
      </div>

      {/* Cliente / entrega */}
      <div className="dash-card mt-5 p-5">
        <div className="flex items-center gap-2">
          <User size={16} style={{ color: "#A67C2E" }} />
          <h2 className="dash-title font-semibold">Cliente e entrega</h2>
        </div>
        <dl className="dash-title mt-3 grid gap-1.5 text-sm">
          <Linha rotulo="Nome" valor={pedido.nomeCliente} />
          <Linha rotulo="E-mail" valor={pedido.clienteEmail ?? "—"} />
          <Linha rotulo="Telefone" valor={pedido.telefone} />
          {pedido.cep && <Linha rotulo="CEP" valor={pedido.cep} />}
          {pedido.endereco && <Linha rotulo="Endereço" valor={pedido.endereco} />}
          {pedido.observacao && <Linha rotulo="Observação" valor={pedido.observacao} />}
        </dl>
      </div>

      {/* Itens */}
      <div className="dash-card mt-5 p-5">
        <div className="flex items-center gap-2">
          <Package size={16} style={{ color: "#A67C2E" }} />
          <h2 className="dash-title font-semibold">Itens</h2>
        </div>
        <div className="mt-3 divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          {pedido.itens.map((it) => (
            <div key={it.id} className="flex items-center gap-3 py-2.5">
              <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
                {it.imagem ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.imagem} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : <Package size={16} style={{ color: "#A67C2E", opacity: 0.6 }} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="dash-title truncate text-sm font-semibold">{it.nome}</p>
                <p className="dash-muted text-xs" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>{it.sku} · {it.qtd} × {reais(it.precoCentavos)}</p>
              </div>
              <span className="dash-title text-sm font-bold">{reais(it.precoCentavos * it.qtd)}</span>
            </div>
          ))}
        </div>
        {pedido.descontoCentavos > 0 && (
          <div className="dash-muted mt-3 space-y-1 border-t pt-3 text-sm" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{reais(pedido.subtotalCentavos)}</span></div>
            <div className="flex items-center justify-between" style={{ color: "#3B6B4A" }}>
              <span>Desconto {pedido.voucherCodigo ? `(${pedido.voucherCodigo})` : ""}</span>
              <span>− {reais(pedido.descontoCentavos)}</span>
            </div>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t pt-3 text-lg" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="dash-title font-semibold">Total</span>
          <strong style={{ color: "#A67C2E" }}>{reais(pedido.totalCentavos)}</strong>
        </div>
      </div>
    </div>
  )
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex gap-2">
      <dt className="dash-muted min-w-[90px]">{rotulo}:</dt>
      <dd className="whitespace-pre-line">{valor}</dd>
    </div>
  )
}
