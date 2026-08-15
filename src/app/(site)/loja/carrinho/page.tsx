"use client"

import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Package } from "lucide-react"
import { useCarrinho } from "../../_components/cart/cart-context"
import { formatBRL } from "@/lib/money"

export default function CarrinhoPage() {
  const { itens, definirQtd, remover, totalCentavos, pronto } = useCarrinho()

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/loja" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Continuar comprando
      </Link>

      <h1 className="mt-6 text-3xl sm:text-4xl">Seu carrinho</h1>

      {!pronto ? null : itens.length === 0 ? (
        <div className="arte-card mt-8 p-10 text-center">
          <span className="arte-ic arte-ic-gold mx-auto"><ShoppingCart size={26} /></span>
          <p className="mt-4">Seu carrinho está vazio.</p>
          <Link href="/loja" className="arte-btn arte-btn-primary mt-5">Ver a loja</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-3">
            {itens.map((it) => (
              <div key={it.produtoId} className="arte-card flex items-center gap-4 p-4">
                <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 10, overflow: "hidden", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
                  {it.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.imagem} alt={it.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : <Package size={20} style={{ color: "var(--arte-gold-deep)" }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/loja/${it.slug}`} className="block truncate font-semibold" style={{ color: "var(--arte-ink)" }}>{it.nome}</Link>
                  <span className="text-sm" style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(it.precoCentavos)}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border" style={{ borderColor: "var(--arte-line)" }}>
                  <button onClick={() => definirQtd(it.produtoId, it.qtd - 1)} className="grid h-8 w-8 place-items-center rounded-full arte-navlink" aria-label="Menos"><Minus size={14} /></button>
                  <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--arte-ink)" }}>{it.qtd}</span>
                  <button onClick={() => definirQtd(it.produtoId, it.qtd + 1)} className="grid h-8 w-8 place-items-center rounded-full arte-navlink" aria-label="Mais"><Plus size={14} /></button>
                </div>
                <button onClick={() => remover(it.produtoId)} className="rounded-lg p-2 hover:opacity-70" style={{ color: "#B87F7C" }} aria-label="Remover"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <div className="arte-card mt-6 p-5">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <strong style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(totalCentavos)}</strong>
            </div>
            <Link href="/loja/checkout" className="arte-btn arte-btn-primary mt-4 w-full">
              Finalizar compra
            </Link>
            <p className="mt-2 text-center text-xs" style={{ color: "var(--arte-ink-soft)" }}>Pagamento via PIX. É preciso estar logado.</p>
          </div>
        </>
      )}
    </div>
  )
}
