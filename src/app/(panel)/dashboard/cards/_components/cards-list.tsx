"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Sparkles, Palette } from "lucide-react"
import type { CardRegistro } from "../_actions/cards-shared"
import { cardToView } from "../_actions/cards-shared"
import { excluirCard } from "../_actions/cards-actions"
import { CardFace } from "./card-faces"

export function CardsList({ initialCards }: { initialCards: CardRegistro[] }) {
  const [cards, setCards] = useState(initialCards)
  const [excluindo, setExcluindo] = useState<string | null>(null)

  async function excluir(card: CardRegistro) {
    if (!confirm(`Excluir o card "${card.nome}"? Esta ação não pode ser desfeita.`)) return
    setExcluindo(card.id)
    const res = await excluirCard(card.id)
    setExcluindo(null)
    if (!res.ok) {
      toast.error("Não foi possível excluir.")
      return
    }
    setCards((prev) => prev.filter((c) => c.id !== card.id))
    toast.success("Card excluído.")
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
            <Sparkles size={14} /> Estúdio de Cards
          </div>
          <h1 className="dash-title mt-1 text-2xl font-bold">Cards dos Santos</h1>
          <p className="dash-subtitle text-sm">
            {cards.length === 0 ? "Nenhum card ainda." : `${cards.length} card${cards.length > 1 ? "s" : ""} cadastrado${cards.length > 1 ? "s" : ""}.`}
          </p>
        </div>
        <Link href="/dashboard/cards/novo" className="dash-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Novo card
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="dash-card flex flex-col items-center justify-center gap-3 p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
            <Palette size={26} />
          </span>
          <h3 className="dash-title text-lg font-semibold">Crie o primeiro card</h3>
          <p className="dash-subtitle max-w-sm text-sm">
            Monte as figurinhas dos Santos no padrão da coleção. Elas ficam salvas aqui para reeditar quando quiser.
          </p>
          <Link href="/dashboard/cards/novo" className="dash-btn-primary mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
            <Plus size={16} /> Novo card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {cards.map((card) => (
            <div key={card.id} className="dash-card p-3">
              <Link href={`/dashboard/cards/${card.id}`} className="flex justify-center" title={`Alterar: ${card.nome}`}>
                <CardFace view={cardToView(card)} side="front" width={150} />
              </Link>
              <div className="mt-2.5 px-0.5">
                <p className="dash-title truncate text-sm font-semibold" title={card.nome}>
                  {card.numero ? `${card.numero} · ` : ""}{card.nome || "Sem nome"}
                </p>
                {card.dataFesta && <p className="dash-muted truncate text-xs">Comemora {card.dataFesta}</p>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href={`/dashboard/cards/${card.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold" style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
                  <Pencil size={13} /> Alterar
                </Link>
                <button onClick={() => excluir(card)} disabled={excluindo === card.id} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold disabled:opacity-50" style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                  <Trash2 size={13} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
