"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShoppingCart, Check, Minus, Plus } from "lucide-react"
import { useCarrinho, type ItemCarrinho } from "./cart-context"

export function AddToCart({ item, estoque }: { item: Omit<ItemCarrinho, "qtd" | "estoque">; estoque: number }) {
  const { adicionar } = useCarrinho()
  const router = useRouter()
  const [qtd, setQtd] = useState(1)
  const [add, setAdd] = useState(false)
  const semEstoque = estoque <= 0

  function adicionarAoCarrinho(irParaCarrinho = false) {
    if (semEstoque) return
    adicionar({ ...item, estoque }, qtd)
    setAdd(true)
    setTimeout(() => setAdd(false), 1500)
    if (irParaCarrinho) router.push("/loja/carrinho")
    else toast.success("Adicionado ao carrinho!")
  }

  if (semEstoque) {
    return <p className="mt-2 text-sm font-semibold" style={{ color: "#B87F7C" }}>Esgotado no momento.</p>
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-1 rounded-full border" style={{ borderColor: "var(--arte-line)" }}>
        <button onClick={() => setQtd((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center rounded-full arte-navlink" aria-label="Menos"><Minus size={15} /></button>
        <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--arte-ink)" }}>{qtd}</span>
        <button onClick={() => setQtd((q) => Math.min(estoque, q + 1))} className="grid h-9 w-9 place-items-center rounded-full arte-navlink" aria-label="Mais"><Plus size={15} /></button>
      </div>
      <button onClick={() => adicionarAoCarrinho(false)} className="arte-btn arte-btn-ghost">
        {add ? <><Check size={17} /> Adicionado</> : <><ShoppingCart size={17} /> Adicionar</>}
      </button>
      <button onClick={() => adicionarAoCarrinho(true)} className="arte-btn arte-btn-primary">
        Comprar agora
      </button>
    </div>
  )
}
