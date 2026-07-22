"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Sparkles, Cross, Church, Palette } from "lucide-react"
import type { CardRegistro } from "../_actions/cards-shared"
import { excluirCard } from "../_actions/cards-actions"

const SERIF = "var(--font-arte-serif), Georgia, serif"

function MiniFront({ card }: { card: CardRegistro }) {
  const e = card.estilo
  const bg = e.usarGradiente ? `linear-gradient(160deg, ${e.frenteBg}, ${e.frenteBg2})` : e.frenteBg
  const borda = e.bordaEstilo === "nenhuma" ? {} : { border: `3px solid ${e.bordaCor}` }
  return (
    <div style={{ aspectRatio: "5 / 7", borderRadius: 8, overflow: "hidden", background: bg, display: "flex", flexDirection: "column", position: "relative", ...borda }}>
      {card.numero && (
        <div style={{ position: "absolute", top: 5, right: 5, zIndex: 3, width: 22, height: 22, borderRadius: "50%", background: "#F6EFDD", border: "1.5px solid #C9A24B", display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 9, color: "#3B322E", lineHeight: 1 }}>{card.numero}</span>
        </div>
      )}
      <div style={{ flex: 1, overflow: "hidden", display: "grid", placeItems: "center" }}>
        {card.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imagem} alt={card.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Cross size={18} style={{ color: e.bordaCor, opacity: 0.7 }} />
        )}
      </div>
      <div style={{ background: e.faixaCor, borderTop: `1.5px solid ${e.bordaCor}`, display: "flex", alignItems: "center", gap: 2, padding: "3px 4px", minHeight: 22 }}>
        <span style={{
          flex: 1, fontFamily: SERIF, fontSize: 8, fontWeight: 700, color: e.nomeCor, lineHeight: 1.05,
          textAlign: "center", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {card.nome}
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 12 }}>
          <Church size={9} style={{ color: e.subtituloCor }} />
          {card.dataFesta && <span style={{ fontSize: 6, color: e.subtituloCor, fontWeight: 700, lineHeight: 1 }}>{card.dataFesta}</span>}
        </div>
      </div>
    </div>
  )
}

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
              <Link href={`/dashboard/cards/${card.id}`} className="block" title={`Alterar: ${card.nome}`}>
                <MiniFront card={card} />
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
