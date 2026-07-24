"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Brain, Check, Printer, Sparkles, Eraser, Layers } from "lucide-react"
import type { CardRegistro } from "../../cards/_actions/cards-shared"
import { cardToView, formatarNumero } from "../../cards/_actions/cards-shared"
import { CardFace } from "../../cards/_components/card-faces"
import { CARDS_POR_FOLHA } from "../../cards/_components/folha-a4"

const ALVO_SANTOS = 24 // 24 pares = 48 cards = 4 folhas

export function MemoriaBuilder({ cards }: { cards: CardRegistro[] }) {
  const [sel, setSel] = useState<string[]>([])

  const conta = useMemo(() => {
    const santos = sel.length
    const totalCards = santos * 2 // sempre em par — nunca mais que duas cópias
    const folhas = Math.ceil(totalCards / CARDS_POR_FOLHA)
    return { santos, pares: santos, totalCards, folhas }
  }, [sel])

  function alternar(id: string) {
    setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  const href = `/print/folha?modo=memoria&ids=${sel.join(",")}`

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Sparkles size={14} /> Produção
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">Jogo da Memória</h1>
        <p className="dash-subtitle text-sm">
          Escolha os Santos. Cada um vira <strong>um par</strong> (2 cards iguais), com o verso padrão da
          Arte&nbsp;&amp;&nbsp;Tradição e <strong>sem numeração</strong>.
        </p>
      </div>

      {/* Painel de contagem */}
      <div className="dash-card mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex flex-wrap items-center gap-6">
          <Contador valor={conta.santos} rotulo="Santos" destaque />
          <Contador valor={conta.pares} rotulo="Pares" />
          <Contador valor={conta.totalCards} rotulo="Cards" />
          <Contador valor={conta.folhas} rotulo={`Folha${conta.folhas === 1 ? "" : "s"} A4`} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSel(cards.slice(0, ALVO_SANTOS).map((c) => c.id))}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
            style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}
            title={`Seleciona os primeiros ${ALVO_SANTOS} — o jogo padrão de 48 cards`}
          >
            <Layers size={14} /> Jogo padrão ({ALVO_SANTOS})
          </button>
          {sel.length > 0 && (
            <button onClick={() => setSel([])} className="dash-muted inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs hover:opacity-80">
              <Eraser size={14} /> Limpar
            </button>
          )}
          {sel.length > 0 ? (
            <Link href={href} className="dash-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              <Printer size={16} /> Gerar folhas
            </Link>
          ) : (
            <span className="dash-muted text-xs">Selecione ao menos um Santo</span>
          )}
        </div>
      </div>

      {/* Grade de seleção */}
      {cards.length === 0 ? (
        <div className="dash-card flex flex-col items-center gap-3 p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
            <Brain size={26} />
          </span>
          <h3 className="dash-title text-lg font-semibold">Nenhum card no catálogo</h3>
          <p className="dash-subtitle max-w-sm text-sm">Cadastre os Santos primeiro para montar o jogo.</p>
          <Link href="/dashboard/cards/novo" className="dash-btn-primary mt-1 rounded-xl px-4 py-2.5 text-sm font-semibold">
            Criar card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
          {cards.map((card) => {
            const ativo = sel.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => alternar(card.id)}
                className="dash-card relative p-2 text-left transition-all"
                style={{ borderColor: ativo ? "#C9A24B" : undefined, boxShadow: ativo ? "0 0 0 2px #C9A24B" : undefined }}
                title={ativo ? "Remover do jogo" : "Adicionar ao jogo"}
              >
                <div className="flex justify-center">
                  <CardFace view={cardToView(card)} side="front" width={116} mostrarNumero />
                </div>
                <p className="dash-title mt-1.5 truncate text-center text-[11px] font-semibold">
                  {card.numero != null && <span className="dash-muted">{formatarNumero(card.numero)} · </span>}
                  {card.nome}
                </p>
                {ativo && (
                  <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "#C9A24B", color: "#fff" }}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Contador({ valor, rotulo, destaque }: { valor: number; rotulo: string; destaque?: boolean }) {
  return (
    <div>
      <p className="text-2xl font-bold leading-none" style={{ color: destaque ? "#A67C2E" : undefined }}>{valor}</p>
      <p className="dash-muted mt-1 text-xs">{rotulo}</p>
    </div>
  )
}
