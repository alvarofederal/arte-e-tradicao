"use client"

import Link from "next/link"
import { ArrowLeft, Printer, Scissors, Info } from "lucide-react"
import type { CardRegistro } from "@/app/(panel)/dashboard/cards/_actions/cards-shared"
import { cardToView } from "@/app/(panel)/dashboard/cards/_actions/cards-shared"
import {
  FolhaA4, emFolhas, espelharParaDuplex, CARDS_POR_FOLHA, type ItemFolha,
} from "@/app/(panel)/dashboard/cards/_components/folha-a4"

export type ModoFolha = "colecionavel" | "memoria"

export function PrintFolhaView({ cards, modo }: { cards: CardRegistro[]; modo: ModoFolha }) {
  const memoria = modo === "memoria"

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
  const folhasVerso = emFolhas(versos).map(espelharParaDuplex)

  // Intercalado (frente, verso, frente, verso…) — correto para impressão duplex.
  const paginas = folhasFrente.flatMap((f, i) => [
    { itens: f, rotulo: `Folha ${i + 1} — frente` },
    { itens: folhasVerso[i] ?? [], rotulo: `Folha ${i + 1} — verso` },
  ])

  const totalCards = frentes.length

  return (
    <div className="print-screen">
      {/* Barra de ações — só na tela */}
      <div className="print-toolbar" style={{
        position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, padding: "12px 16px", background: "#2b2b2b", color: "#fff", flexWrap: "wrap",
      }}>
        <Link href={memoria ? "/dashboard/memoria" : "/dashboard/cards"}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none", fontSize: 14 }}>
          <ArrowLeft size={16} /> Voltar
        </Link>
        <span style={{ fontSize: 13, opacity: 0.85, textAlign: "center" }}>
          {memoria
            ? `Jogo da memória · ${cards.length} Santo${cards.length > 1 ? "s" : ""} · ${cards.length} par${cards.length > 1 ? "es" : ""} · ${totalCards} cards`
            : `Cards colecionáveis · ${totalCards} card${totalCards > 1 ? "s" : ""}`}
          {" · "}{folhasFrente.length} folha{folhasFrente.length > 1 ? "s" : ""} (frente + verso)
        </span>
        <button onClick={() => window.print()} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24B", color: "#2b2320",
          border: 0, borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Instruções — só na tela */}
      <div className="print-toolbar" style={{ padding: "14px 16px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#fff8e6", border: "1px solid #e6d3a3", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#5b4a2a" }}>
          <Info size={16} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <strong>Imprima em 100% (tamanho real)</strong> — desative "ajustar à página", senão os cards saem fora de 49 × 65 mm.
            {" "}As páginas já estão intercaladas <strong>frente e verso</strong> (o verso vai espelhado para cair atrás da frente certa).
            {" "}Corte na linha tracejada.
          </div>
        </div>
      </div>

      {/* Folhas */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "20px 16px 60px" }}>
        {paginas.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span className="print-toolbar" style={{ fontSize: 12, color: "#6b6b6b", display: "flex", alignItems: "center", gap: 6 }}>
              <Scissors size={12} /> {p.rotulo}
            </span>
            <FolhaA4 itens={p.itens} />
          </div>
        ))}
        {paginas.length === 0 && (
          <p style={{ color: "#666", padding: 40 }}>Nenhum card selecionado.</p>
        )}
      </div>
    </div>
  )
}

export { CARDS_POR_FOLHA }
