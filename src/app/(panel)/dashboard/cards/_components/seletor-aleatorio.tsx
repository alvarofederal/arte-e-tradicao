"use client"

import { useState } from "react"
import { Shuffle } from "lucide-react"

/**
 * Campo de quantidade + botão "Sortear": escolhe N cards aleatórios do catálogo.
 * Cada clique gera um novo sorteio (embaralha). Útil quando há centenas de imagens.
 */
export function SeletorAleatorio({
  total,
  padrao = 24,
  onSortear,
}: {
  total: number
  padrao?: number
  onSortear: (n: number) => void
}) {
  const [txt, setTxt] = useState(String(Math.min(padrao, total)))

  function sortear() {
    let n = parseInt(txt.replace(/\D/g, ""), 10)
    if (!n || n < 1) n = 1
    if (n > total) n = total
    setTxt(String(n))
    onSortear(n)
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        value={txt}
        inputMode="numeric"
        onChange={(e) => setTxt(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => { if (e.key === "Enter") sortear() }}
        className="dash-input"
        style={{ width: 62, textAlign: "center", fontWeight: 700 }}
        title={`Quantos sortear (máx. ${total})`}
        aria-label="Quantidade a sortear"
      />
      <button
        onClick={sortear}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
        style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}
        title={`Sortear aleatoriamente entre os ${total}`}
      >
        <Shuffle size={14} /> Sortear
      </button>
    </div>
  )
}
