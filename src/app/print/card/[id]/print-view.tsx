"use client"

import Link from "next/link"
import { ArrowLeft, Printer, Scissors } from "lucide-react"
import type { CardRegistro } from "@/app/(panel)/dashboard/cards/_actions/cards-shared"
import { cardToView } from "@/app/(panel)/dashboard/cards/_actions/cards-shared"
import { CardFace, CARD_PRINT_W } from "@/app/(panel)/dashboard/cards/_components/card-faces"

const PRINT_W = CARD_PRINT_W

export function PrintView({ card }: { card: CardRegistro }) {
  const view = cardToView(card)

  return (
    <div className="print-screen">
      {/* Barra de ações — só na tela */}
      <div className="print-toolbar" style={{
        position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, padding: "12px 16px", background: "#2b2b2b", color: "#fff",
      }}>
        <Link href={`/dashboard/cards/${card.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none", fontSize: 14 }}>
          <ArrowLeft size={16} /> Voltar ao editor
        </Link>
        <span style={{ fontSize: 13, opacity: 0.8, textAlign: "center", flex: 1 }}>
          Prévia de impressão · {card.nome}
        </span>
        <button onClick={() => window.print()} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24B", color: "#2b2320",
          border: 0, borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Folha A4 */}
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px 60px" }}>
        <div className="print-page" style={{ width: "210mm", minHeight: "297mm", padding: "14mm", boxSizing: "border-box" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8mm", alignItems: "flex-start" }}>
            <div style={{ textAlign: "center" }}>
              <CardFace view={view} side="front" width={PRINT_W} />
              <div style={{ fontSize: 9, color: "#888", marginTop: 4 }}>Frente</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <CardFace view={view} side="back" width={PRINT_W} />
              <div style={{ fontSize: 9, color: "#888", marginTop: 4 }}>Verso</div>
            </div>
          </div>

          <p style={{ marginTop: "10mm", fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 6 }}>
            <Scissors size={13} /> Recorte na moldura. Tamanho real: 4,9 × 6,5 cm (figurinha).
          </p>
        </div>
      </div>
    </div>
  )
}
