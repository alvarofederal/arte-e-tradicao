"use client"

import { CardFace, CARD_MM, CARD_PRINT_W } from "./card-faces"
import type { CardView } from "../_actions/cards-shared"
import "./card-studio.css"

/* Gabarito: 4 colunas × 3 linhas = 12 cards por folha A4 (49 × 65 mm cada). */
export const COLUNAS = 4
export const LINHAS = 3
export const CARDS_POR_FOLHA = COLUNAS * LINHAS // 12

const GAP_MM = 2      // espaço mínimo entre os cards (guia de corte)
const MARGEM_TOPO = 12
// 4 × 49 + 3 × 2 = 202 mm → sobra 8 mm → 4 mm de margem lateral
const MARGEM_LADO = (210 - (COLUNAS * CARD_MM.w + (COLUNAS - 1) * GAP_MM)) / 2

export interface ItemFolha {
  view: CardView
  side: "front" | "back"
  mostrarNumero?: boolean
  versoTipo?: "descricao" | "logo"
}

/**
 * Espelha cada linha (direita↔esquerda) para que, na impressão frente-e-verso,
 * cada verso caia exatamente atrás da sua frente. Preenche a linha com vazios.
 */
export function espelharParaDuplex(itens: (ItemFolha | null)[]): (ItemFolha | null)[] {
  const completos = [...itens]
  while (completos.length % COLUNAS !== 0) completos.push(null)
  const saida: (ItemFolha | null)[] = []
  for (let i = 0; i < completos.length; i += COLUNAS) {
    saida.push(...completos.slice(i, i + COLUNAS).reverse())
  }
  return saida
}

/** Uma folha A4 com até 12 cards no tamanho real, com linha tracejada de corte. */
export function FolhaA4({ itens }: { itens: (ItemFolha | null)[] }) {
  return (
    <div
      className="folha-a4 print-sheet"
      style={{
        width: "210mm",
        height: "297mm",
        boxSizing: "border-box",
        padding: `${MARGEM_TOPO}mm ${MARGEM_LADO}mm`,
        background: "#fff",
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLUNAS}, ${CARD_MM.w}mm)`,
          gap: `${GAP_MM}mm`,
          alignContent: "start",
        }}
      >
        {itens.map((it, i) => (
          <div
            key={i}
            style={{
              width: `${CARD_MM.w}mm`,
              height: `${CARD_MM.h}mm`,
              // guia de corte: outline não ocupa espaço no layout
              outline: it ? "0.2mm dashed rgba(0,0,0,0.40)" : "none",
              outlineOffset: 0,
            }}
          >
            {it && (
              <CardFace
                view={it.view}
                side={it.side}
                width={CARD_PRINT_W}
                mostrarNumero={it.mostrarNumero}
                versoTipo={it.versoTipo}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Quebra uma lista de itens em folhas de 12. */
export function emFolhas<T>(itens: T[], porFolha = CARDS_POR_FOLHA): T[][] {
  const folhas: T[][] = []
  for (let i = 0; i < itens.length; i += porFolha) folhas.push(itens.slice(i, i + porFolha))
  return folhas
}
