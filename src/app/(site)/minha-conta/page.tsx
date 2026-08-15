import Link from "next/link"
import { redirect } from "next/navigation"
import { Clover, Package, ShoppingBag } from "lucide-react"
import { auth } from "@/lib/auth"
import { listarMeusPedidos } from "@/lib/pedidos"

export const dynamic = "force-dynamic"

export default async function MinhaContaPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/minha-conta")

  const pedidos = await listarMeusPedidos(session.user.id)
  const aguardando = pedidos.filter((p) => p.status === "AGUARDANDO_PAGAMENTO").length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="arte-card p-5">
          <span className="arte-ic arte-ic-gold"><Package size={20} /></span>
          <p className="mt-3 text-3xl font-bold">{pedidos.length}</p>
          <p className="text-sm" style={{ color: "var(--arte-ink-soft)" }}>Pedidos feitos</p>
        </div>
        <div className="arte-card p-5">
          <span className="arte-ic arte-ic-gold"><ShoppingBag size={20} /></span>
          <p className="mt-3 text-3xl font-bold">{aguardando}</p>
          <p className="text-sm" style={{ color: "var(--arte-ink-soft)" }}>Aguardando pagamento</p>
        </div>
        <Link href="/minha-conta/sorte" className="arte-card p-5 transition-transform hover:-translate-y-0.5">
          <span className="arte-ic arte-ic-gold"><Clover size={20} /></span>
          <p className="mt-3 text-lg font-bold">Tente a sorte</p>
          <p className="text-sm" style={{ color: "var(--arte-ink-soft)" }}>Tem um código na sua caixa? Ganhe desconto.</p>
        </Link>
      </div>

      <div className="arte-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Pedidos recentes</h2>
          <Link href="/minha-conta/pedidos" className="text-sm font-semibold" style={{ color: "var(--arte-gold-deep)" }}>Ver todos →</Link>
        </div>
        {pedidos.length === 0 ? (
          <div className="mt-4 text-center">
            <p style={{ color: "var(--arte-ink-soft)" }}>Você ainda não fez pedidos.</p>
            <Link href="/loja" className="arte-btn arte-btn-primary mt-4">Conhecer a loja</Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y" style={{ borderColor: "var(--arte-line)" }}>
            {pedidos.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link href={`/loja/pedido/${p.id}`} className="flex items-center justify-between py-3 arte-navlink">
                  <span>Pedido #{p.numero}</span>
                  <span style={{ color: "var(--arte-ink-soft)" }}>{p.quantidadeItens} item(ns)</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
