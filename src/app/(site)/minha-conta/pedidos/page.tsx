import Link from "next/link"
import { redirect } from "next/navigation"
import { Package } from "lucide-react"
import { auth } from "@/lib/auth"
import { listarMeusPedidos, STATUS_LABEL, STATUS_COR } from "@/lib/pedidos"
import { formatBRL } from "@/lib/money"

export const dynamic = "force-dynamic"

function dataBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d)
}

export default async function MeusPedidosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/minha-conta/pedidos")

  const pedidos = await listarMeusPedidos(session.user.id)

  if (pedidos.length === 0) {
    return (
      <div className="arte-card p-10 text-center">
        <span className="arte-ic arte-ic-gold mx-auto"><Package size={24} /></span>
        <p className="mt-4">Você ainda não fez pedidos.</p>
        <Link href="/loja" className="arte-btn arte-btn-primary mt-5">Conhecer a loja</Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {pedidos.map((p) => {
        const cor = STATUS_COR[p.status]
        return (
          <Link key={p.id} href={`/loja/pedido/${p.id}`} className="arte-card flex flex-wrap items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">Pedido #{p.numero}</span>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: cor.bg, color: cor.fg }}>{STATUS_LABEL[p.status]}</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--arte-ink-soft)" }}>
                {dataBR(p.criadoEm)} · {p.quantidadeItens} item(ns)
              </p>
            </div>
            <span className="text-lg font-bold" style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(p.totalCentavos)}</span>
          </Link>
        )
      })}
    </div>
  )
}
