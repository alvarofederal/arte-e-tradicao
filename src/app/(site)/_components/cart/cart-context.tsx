"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface ItemCarrinho {
  produtoId: string
  sku: string
  nome: string
  slug: string
  precoCentavos: number
  imagem: string | null
  qtd: number
}

interface CarrinhoCtx {
  itens: ItemCarrinho[]
  adicionar: (item: Omit<ItemCarrinho, "qtd">, qtd?: number) => void
  definirQtd: (produtoId: string, qtd: number) => void
  remover: (produtoId: string) => void
  limpar: () => void
  totalCentavos: number
  quantidade: number
  pronto: boolean
}

const Ctx = createContext<CarrinhoCtx | null>(null)
const KEY = "arte-carrinho-v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItens(JSON.parse(raw))
    } catch {}
    setPronto(true)
  }, [])

  useEffect(() => {
    if (!pronto) return
    try { localStorage.setItem(KEY, JSON.stringify(itens)) } catch {}
  }, [itens, pronto])

  function adicionar(item: Omit<ItemCarrinho, "qtd">, qtd = 1) {
    setItens((prev) => {
      const i = prev.findIndex((x) => x.produtoId === item.produtoId)
      if (i >= 0) {
        const copia = [...prev]
        copia[i] = { ...copia[i], qtd: copia[i].qtd + qtd }
        return copia
      }
      return [...prev, { ...item, qtd }]
    })
  }
  function definirQtd(produtoId: string, qtd: number) {
    setItens((prev) => prev.flatMap((x) => {
      if (x.produtoId !== produtoId) return [x]
      const n = Math.max(0, qtd)
      return n === 0 ? [] : [{ ...x, qtd: n }]
    }))
  }
  function remover(produtoId: string) {
    setItens((prev) => prev.filter((x) => x.produtoId !== produtoId))
  }
  function limpar() { setItens([]) }

  const totalCentavos = useMemo(() => itens.reduce((s, x) => s + x.precoCentavos * x.qtd, 0), [itens])
  const quantidade = useMemo(() => itens.reduce((s, x) => s + x.qtd, 0), [itens])

  return (
    <Ctx.Provider value={{ itens, adicionar, definirQtd, remover, limpar, totalCentavos, quantidade, pronto }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCarrinho() {
  const c = useContext(Ctx)
  if (!c) throw new Error("useCarrinho fora do CartProvider")
  return c
}
