"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Scissors, Info, RotateCw } from "lucide-react"
import type { CardRegistro } from "@/app/(panel)/dashboard/cards/_actions/cards-shared"
import { cardToView } from "@/app/(panel)/dashboard/cards/_actions/cards-shared"
import {
  FolhaA4, emFolhas, espelharParaDuplex, CARDS_POR_FOLHA, type ItemFolha,
} from "@/app/(panel)/dashboard/cards/_components/folha-a4"

export type ModoFolha = "colecionavel" | "memoria"
type Lado = "frente" | "verso"

export function PrintFolhaView({ cards, modo }: { cards: CardRegistro[]; modo: ModoFolha }) {
  const memoria = modo === "memoria"
  const [lado, setLado] = useState<Lado>("frente")

  // Jogo da memória: exatamente 2 cópias por Santo (par) — nunca mais que duas.
  // Colecionável: 1 cópia por card.
  const frentes: ItemFolha[] = cards.flatMap((c) => {
    const base: ItemFolha = {
      view: cardToView(c),
      side: "front",
      mostrarNumero: !memoria,                     // memória não tem numeração
      versoTipo: memoria ? "logo" : "descricao",
    }
    return memoria ? [base, { ...base }] : [base]
  })
  const versos: ItemFolha[] = frentes.map((it) => ({ ...it, side: "back" }))

  const folhasFrente = emFolhas(frentes)
  // espelhado: ao virar o maço, cada verso cai atrás da sua própria frente
  const folhasVerso = emFolhas(versos).map(espelharParaDuplex)

  const folhas = lado === "frente" ? folhasFrente : folhasVerso
  const totalCards = frentes.length
  const qtdFolhas = folhasFrente.length

  return (
    <div className="print-screen">
      {/* Barra de ações — só na tela */}
      <div className="print-toolbar" style={{
        position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, padding: "10px 16px", background: "#2b2b2b", color: "#fff", flexWrap: "wrap",
      }}>
        <Link href={memoria ? "/dashboard/memoria" : "/dashboard/cards"}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none", fontSize: 14 }}>
          <ArrowLeft size={16} /> Voltar
        </Link>

        {/* Alternador de lado */}
        <div style={{ display: "flex", background: "#1c1c1c", borderRadius: 10, padding: 3, gap: 3 }}>
          {(["frente", "verso"] as Lado[]).map((l) => (
            <button key={l} onClick={() => setLado(l)} style={{
              border: 0, cursor: "pointer", borderRadius: 8, padding: "7px 16px", fontSize: 14, fontWeight: 700,
              background: lado === l ? "#C9A24B" : "transparent",
              color: lado === l ? "#2b2320" : "rgba(255,255,255,0.65)",
            }}>
              {l === "frente" ? "1. Frentes" : "2. Versos"}
            </button>
          ))}
        </div>

        <button onClick={() => window.print()} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24B", color: "#2b2320",
          border: 0, borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          <Printer size={16} /> Imprimir {lado === "frente" ? "frentes" : "versos"}
        </button>
      </div>

      {/* Instruções — só na tela */}
      <div className="print-toolbar" style={{ padding: "14px 16px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: "#4a4a4a", marginBottom: 8 }}>
          {memoria
            ? `Jogo da memória · ${cards.length} Santo${cards.length > 1 ? "s" : ""} · ${cards.length} par${cards.length > 1 ? "es" : ""} · ${totalCards} cards`
            : `Cards colecionáveis · ${totalCards} card${totalCards > 1 ? "s" : ""}`}
          {" · "}{qtdFolhas} folha{qtdFolhas > 1 ? "s" : ""} de cada lado
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#fff8e6", border: "1px solid #e6d3a3", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#5b4a2a" }}>
          <Info size={16} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <strong>Imprima em 100% (tamanho real)</strong> — desative “ajustar à página”, senão os cards saem fora de 49 × 65 mm.
            <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "flex-start" }}>
              <RotateCw size={15} style={{ marginTop: 1, flexShrink: 0 }} />
              <span>
                <strong>Frente e verso:</strong> imprima primeiro as <strong>frentes</strong>. Depois pegue o maço,
                <strong> vire da esquerda para a direita</strong> (como se virasse a página de um livro), recoloque na bandeja,
                clique em <strong>“2. Versos”</strong> e imprima. Os versos já saem espelhados para cair atrás do card certo.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Folhas do lado selecionado */}
      <div className="folhas-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "20px 16px 60px" }}>
        {folhas.map((itens, i) => (
          <div key={`${lado}-${i}`} className="folha-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span className="print-toolbar" style={{ fontSize: 12, color: "#6b6b6b", display: "flex", alignItems: "center", gap: 6 }}>
              <Scissors size={12} /> Folha {i + 1} de {qtdFolhas} — {lado === "frente" ? "frente" : "verso (espelhado)"}
            </span>
            <FolhaA4 itens={itens} />
          </div>
        ))}
        {folhas.length === 0 && (
          <p style={{ color: "#666", padding: 40 }}>Nenhum card selecionado.</p>
        )}
      </div>
    </div>
  )
}

export { CARDS_POR_FOLHA }
