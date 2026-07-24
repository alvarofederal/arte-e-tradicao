"use client"

import { forwardRef } from "react"
import { Church, Cross, Upload } from "lucide-react"
import type { CardView } from "../_actions/cards-shared"
import { formatarNumero } from "../_actions/cards-shared"
import "./card-studio.css"

/** Tamanho real da figurinha: 49 × 65 mm. */
export const CARD_MM = { w: 49, h: 65 }
export const CARD_RATIO = CARD_MM.h / CARD_MM.w // 1.3265…
/** 49 mm convertidos para px a 96 dpi (≈185,2) — tamanho real na impressão. */
export const CARD_PRINT_W = (CARD_MM.w / 25.4) * 96

const REF_W = 260 // largura de referência (medidas internas escalam por width/REF_W)
const SERIF = "var(--font-arte-serif), Georgia, 'Times New Roman', serif"

/** Verso do jogo da memória: idêntico em todos os cards (senão dá pra identificar de costas). */
const LOGO_VERSO = {
  fundo: "#FBF6EC",
  moldura: "#C9A24B",
  tinta: "#3B322E",
  acento: "#A67C2E",
}

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
  /** Frente: exibe o selo do número (colecionável sim, jogo da memória não). */
  mostrarNumero?: boolean
  /** Verso: descritivo (colecionável) ou logo uniforme (jogo da memória). */
  versoTipo?: "descricao" | "logo"
}

export const CardFace = forwardRef<HTMLDivElement, Props>(function CardFace(
  { view: v, side, width = REF_W, mostrarNumero = true, versoTipo = "descricao" },
  ref
) {
  const k = width / REF_W
  const s = (n: number) => n * k
  const H = Math.round(width * CARD_RATIO)
  const frenteFundo = v.usarGradiente ? `linear-gradient(160deg, ${v.frenteBg}, ${v.frenteBg2})` : v.frenteBg

  /* ── FRENTE ── */
  if (side === "front") {
    return (
      <div ref={ref} style={{
        width, height: H, borderRadius: s(10), overflow: "hidden", background: frenteFundo,
        position: "relative", display: "flex", flexDirection: "column", ...bordaStyle(v, s),
      }}>
        {mostrarNumero && v.numero != null && (
          <div style={{
            position: "absolute", top: s(10), right: s(10), zIndex: 4, width: s(34), height: s(34),
            borderRadius: "50%", background: "#F6EFDD", border: `${s(2)}px solid #C9A24B`,
            display: "grid", placeItems: "center", boxShadow: `0 ${s(2)}px ${s(5)}px rgba(0,0,0,0.28)`,
          }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: s(13.5), color: "#3B322E", lineHeight: 1 }}>
              {formatarNumero(v.numero)}
            </span>
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
              color: "rgba(59,50,46,0.35)", textAlign: "center", padding: s(14),
              background: "repeating-linear-gradient(45deg, rgba(59,50,46,0.03) 0 10px, transparent 10px 20px)",
            }}>
              <div><Upload size={s(24)} style={{ margin: "0 auto 6px" }} /><p style={{ fontSize: s(11), fontWeight: 600 }}>Envie a imagem do Santo</p></div>
            </div>
          )}
        </div>

        <div className={`cardstudio-shine${v.holografico ? " cardstudio-holo" : ""}`} style={{
          background: v.faixaCor, borderTop: `${s(2)}px solid ${v.bordaCor}`,
          display: "flex", alignItems: "center", gap: s(4), padding: `${s(5)}px ${s(7)}px`, minHeight: s(42),
        }}>
          <div style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 2, paddingLeft: s(20) }}>
            <span style={{ fontFamily: SERIF, fontSize: s(14), fontWeight: 700, color: v.nomeCor, lineHeight: 1.05, display: "block" }}>
              {v.nome || "Nome do Santo"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, minWidth: s(20) }}>
            <Church size={s(13)} style={{ color: v.subtituloCor }} />
            {v.dataFesta && (
              <span style={{
                // data com ano (ex.: 15/10/1582) é maior — reduz a fonte para caber
                fontSize: s(v.dataFesta.length > 6 ? 6.2 : 8),
                color: v.subtituloCor, marginTop: 1, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                {v.dataFesta}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── VERSO: LOGO UNIFORME (jogo da memória) ── */
  if (versoTipo === "logo") {
    return (
      <div ref={ref} style={{
        width, height: H, borderRadius: s(10), overflow: "hidden", background: LOGO_VERSO.fundo,
        border: `${s(10)}px solid ${LOGO_VERSO.moldura}`,
        boxShadow: `inset 0 0 0 ${s(2)}px rgba(255,255,255,0.35)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: s(6), padding: s(12), textAlign: "center",
      }}>
        <Cross size={s(34)} style={{ color: LOGO_VERSO.acento }} strokeWidth={1.6} />
        <div style={{ fontFamily: SERIF, fontSize: s(17), fontWeight: 700, color: LOGO_VERSO.tinta, lineHeight: 1.1 }}>
          Arte&nbsp;&amp;<br />Tradição
        </div>
        <div style={{ width: s(40), height: s(2), borderRadius: s(2), background: LOGO_VERSO.acento }} />
        <div style={{ fontSize: s(7.5), letterSpacing: "0.14em", textTransform: "uppercase", color: LOGO_VERSO.acento, fontWeight: 700 }}>
          Jogo da Memória
        </div>
      </div>
    )
  }

  /* ── VERSO: DESCRITIVO (colecionável) ── */
  return (
    <div ref={ref} style={{
      width, height: H, borderRadius: s(10), overflow: "hidden", background: v.versoBg,
      position: "relative", display: "flex", flexDirection: "column", padding: s(15), ...bordaStyle(v, s),
    }}>
      <div style={{ textAlign: "center" }}>
        <Cross size={s(16)} style={{ color: v.acento, margin: "0 auto" }} />
        <div style={{ fontFamily: SERIF, fontSize: s(15), fontWeight: 700, color: v.versoTextoCor, marginTop: s(5), lineHeight: 1.1 }}>
          {v.nome || "Nome do Santo"}
        </div>
        <div style={{ width: s(42), height: s(2), borderRadius: s(2), background: v.acento, margin: `${s(7)}px auto 0` }} />
      </div>
      <p style={{ flex: 1, marginTop: s(10), fontSize: s(10.5), lineHeight: 1.5, color: v.versoTextoCor, textAlign: "center", overflow: "hidden" }}>
        {v.descricao || "Descrição do Santo..."}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: s(5), fontSize: s(8.5), color: v.acento, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        <Church size={s(10)} /> {v.dataFesta || "Arte & Tradição"}
      </div>
    </div>
  )
})
