"use client"

import { forwardRef } from "react"
import { Church, Cross, Upload } from "lucide-react"
import type { CardView } from "../_actions/cards-shared"
import "./card-studio.css"

const REF_W = 260 // largura de referência (todas as medidas escalam por width/REF_W)
const SERIF = "var(--font-arte-serif), Georgia, 'Times New Roman', serif"

function bordaStyle(v: CardView, s: (n: number) => number): React.CSSProperties {
  switch (v.bordaEstilo) {
    case "nenhuma": return {}
    case "solida": return { border: `${s(v.bordaLargura)}px solid ${v.bordaCor}` }
    case "dupla": return { border: `${s(v.bordaLargura)}px double ${v.bordaCor}` }
    case "classica": return {
      border: `${s(v.bordaLargura)}px solid ${v.bordaCor}`,
      boxShadow: `inset 0 0 0 ${s(2)}px rgba(255,255,255,0.35)`,
    }
  }
}

interface Props {
  view: CardView
  side: "front" | "back"
  width?: number
}

/** Renderiza uma face do card em qualquer tamanho (px), escalando tudo. */
export const CardFace = forwardRef<HTMLDivElement, Props>(function CardFace({ view: v, side, width = REF_W }, ref) {
  const k = width / REF_W
  const s = (n: number) => n * k
  const H = Math.round((width * 7) / 5)
  const frenteFundo = v.usarGradiente ? `linear-gradient(160deg, ${v.frenteBg}, ${v.frenteBg2})` : v.frenteBg

  if (side === "front") {
    return (
      <div ref={ref} style={{
        width, height: H, borderRadius: s(12), overflow: "hidden", background: frenteFundo,
        position: "relative", display: "flex", flexDirection: "column", ...bordaStyle(v, s),
      }}>
        {v.numero && (
          <div style={{
            position: "absolute", top: s(12), right: s(12), zIndex: 4, width: s(38), height: s(38),
            borderRadius: "50%", background: "#F6EFDD", border: `${s(2)}px solid #C9A24B`,
            display: "grid", placeItems: "center", boxShadow: `0 ${s(2)}px ${s(6)}px rgba(0,0,0,0.28)`,
          }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: s(15), color: "#3B322E", lineHeight: 1 }}>{v.numero}</span>
          </div>
        )}

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {v.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.imagem} alt={v.nome} style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: `${v.imgPosX ?? 50}% ${v.imgPosY ?? 50}%`,
              transform: `scale(${v.imgScale ?? 1})`, transformOrigin: "center",
            }} />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "grid", placeItems: "center",
              color: "rgba(59,50,46,0.35)", textAlign: "center", padding: s(16),
              background: "repeating-linear-gradient(45deg, rgba(59,50,46,0.03) 0 10px, transparent 10px 20px)",
            }}>
              <div><Upload size={s(26)} style={{ margin: "0 auto 8px" }} /><p style={{ fontSize: s(12), fontWeight: 600 }}>Envie a imagem do Santo</p></div>
            </div>
          )}
        </div>

        <div className={`cardstudio-shine${v.holografico ? " cardstudio-holo" : ""}`} style={{
          background: v.faixaCor, borderTop: `${s(2)}px solid ${v.bordaCor}`,
          display: "flex", alignItems: "center", gap: s(4), padding: `${s(6)}px ${s(8)}px`, minHeight: s(46),
        }}>
          <div style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 2, paddingLeft: s(22) }}>
            <span style={{ fontFamily: SERIF, fontSize: s(14.5), fontWeight: 700, color: v.nomeCor, lineHeight: 1.05, display: "block" }}>
              {v.nome || "Nome do Santo"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, minWidth: s(22) }}>
            <Church size={s(14)} style={{ color: v.subtituloCor }} />
            {v.dataFesta && <span style={{ fontSize: s(8.5), color: v.subtituloCor, marginTop: 1, fontWeight: 700 }}>{v.dataFesta}</span>}
          </div>
        </div>
      </div>
    )
  }

  // VERSO
  return (
    <div ref={ref} style={{
      width, height: H, borderRadius: s(12), overflow: "hidden", background: v.versoBg,
      position: "relative", display: "flex", flexDirection: "column", padding: s(18), ...bordaStyle(v, s),
    }}>
      <div style={{ textAlign: "center" }}>
        <Cross size={s(18)} style={{ color: v.acento, margin: "0 auto" }} />
        <div style={{ fontFamily: SERIF, fontSize: s(16), fontWeight: 700, color: v.versoTextoCor, marginTop: s(6), lineHeight: 1.1 }}>
          {v.nome || "Nome do Santo"}
        </div>
        {v.numero && <div style={{ fontSize: s(9), color: v.acento, fontWeight: 700, marginTop: s(2) }}>Nº {v.numero}</div>}
        <div style={{ width: s(46), height: s(2), borderRadius: s(2), background: v.acento, margin: `${s(8)}px auto 0` }} />
      </div>
      <p style={{ flex: 1, marginTop: s(12), fontSize: s(11), lineHeight: 1.55, color: v.versoTextoCor, textAlign: "center", overflow: "hidden" }}>
        {v.descricao || "Descrição do Santo..."}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: s(6), fontSize: s(9), color: v.acento, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        <Church size={s(11)} /> {v.dataFesta || "Arte & Tradição"}
      </div>
    </div>
  )
})
