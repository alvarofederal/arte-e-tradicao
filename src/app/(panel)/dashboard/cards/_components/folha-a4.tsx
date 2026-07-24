"use client"

import { CardFace, CARD_MM, CARD_PRINT_W } from "./card-faces"
import type { CardView } from "../_actions/cards-shared"
import "./card-studio.css"

/* Gabarito: 4 colunas × 4 linhas = 16 cards por folha A4 (49 × 65 mm cada).
   Largura: 4×49 + 3×2 = 202 mm (de 210) → 4 mm de margem lateral
   Altura:  4×65 + 3×2 = 266 mm (de 297) → sobram 31 mm para margens/marcas */
export const COLUNAS = 4
export const LINHAS = 4
export const CARDS_POR_FOLHA = COLUNAS * LINHAS // 16

const GAP_MM = 2      // espaço mínimo entre os cards
const MARGEM_TOPO = 12
const MARGEM_LADO = (210 - (COLUNAS * CARD_MM.w + (COLUNAS - 1) * GAP_MM)) / 2

const TRACO = "0.25mm"        // espessura da marca de corte
const COR_TRACO = "#111"
const TICK_V = 4              // comprimento das marcas verticais (mm)
const TICK_H = 3              // comprimento das marcas horizontais (mm) — margem lateral é 4mm

/** Posições (mm) das bordas verticais dos cards, da esquerda da folha. */
function bordasX(): number[] {
  const xs: number[] = []
  for (let i = 0; i < COLUNAS; i++) {
    const x = MARGEM_LADO + i * (CARD_MM.w + GAP_MM)
    xs.push(x, x + CARD_MM.w)
  }
  return xs
}
/** Posições (mm) das bordas horizontais dos cards, do topo da folha. */
function bordasY(): number[] {
  const ys: number[] = []
  for (let j = 0; j < LINHAS; j++) {
    const y = MARGEM_TOPO + j * (CARD_MM.h + GAP_MM)
    ys.push(y, y + CARD_MM.h)
  }
  return ys
}

const FIM_GRADE = MARGEM_TOPO + LINHAS * CARD_MM.h + (LINHAS - 1) * GAP_MM // 211mm

/** Marcas de corte nas margens — nada é impresso sobre os cards. */
function MarcasDeCorte() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* verticais: nas margens de cima e de baixo, alinhadas às colunas */}
      {bordasX().map((x, i) => (
        <div key={`vx${i}`}>
          <div style={{ position: "absolute", left: `${x}mm`, top: `${MARGEM_TOPO - TICK_V - 2}mm`, width: TRACO, height: `${TICK_V}mm`, background: COR_TRACO }} />
          <div style={{ position: "absolute", left: `${x}mm`, top: `${FIM_GRADE + 2}mm`, width: TRACO, height: `${TICK_V}mm`, background: COR_TRACO }} />
        </div>
      ))}
      {/* horizontais: nas margens esquerda e direita, alinhadas às linhas */}
      {bordasY().map((y, i) => (
        <div key={`hy${i}`}>
          <div style={{ position: "absolute", top: `${y}mm`, left: `${MARGEM_LADO - TICK_H - 0.5}mm`, height: TRACO, width: `${TICK_H}mm`, background: COR_TRACO }} />
          <div style={{ position: "absolute", top: `${y}mm`, left: `${210 - MARGEM_LADO + 0.5}mm`, height: TRACO, width: `${TICK_H}mm`, background: COR_TRACO }} />
        </div>
      ))}
    </div>
  )
}

/** Régua de conferência: se não medir 50 mm, a impressão não saiu em 100%. */
function ReguaDeEscala() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3mm", color: "#555", fontSize: "2.6mm" }}>
      <div style={{ position: "relative", width: "50mm", height: "3mm" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: "1.5mm", height: TRACO, background: COR_TRACO }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: TRACO, height: "3mm", background: COR_TRACO }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: TRACO, height: "3mm", background: COR_TRACO }} />
      </div>
      <span>50 mm — confira com a régua: se não bater, imprima em 100% (sem “ajustar à página”).</span>
    </div>
  )
}

export interface ItemFolha {
  view: CardView
  side: "front" | "back"
  mostrarNumero?: boolean
  versoTipo?: "descricao" | "logo"
}

/** Uma folha A4 com até 12 cards no tamanho real e as marcas de corte. */
export function FolhaA4({ itens }: { itens: (ItemFolha | null)[] }) {
  return (
    <div
      className="folha-a4 print-sheet"
      style={{
        position: "relative",
        width: "210mm",
        height: "297mm",
        boxSizing: "border-box",
        padding: `${MARGEM_TOPO}mm ${MARGEM_LADO}mm`,
        background: "#fff",
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <MarcasDeCorte />

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
            className="folha-slot"
            style={{ width: `${CARD_MM.w}mm`, height: `${CARD_MM.h}mm` }}
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

      {/* posição fixa no rodapé: com 4 linhas o espaço é curto e a régua
          não pode empurrar a grade */}
      <div style={{ position: "absolute", left: `${MARGEM_LADO}mm`, top: `${FIM_GRADE + TICK_V + 4}mm` }}>
        <ReguaDeEscala />
      </div>
    </div>
  )
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

/** Quebra uma lista de itens em folhas de 12. */
export function emFolhas<T>(itens: T[], porFolha = CARDS_POR_FOLHA): T[][] {
  const folhas: T[][] = []
  for (let i = 0; i < itens.length; i += porFolha) folhas.push(itens.slice(i, i + porFolha))
  return folhas
}
