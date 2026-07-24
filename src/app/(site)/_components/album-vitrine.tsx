// Vitrine do álbum na landing — mostra os Santos reais do catálogo.
// Os dados vêm de src/data/vitrine.json (gerado por scripts/gerar-vitrine.ts),
// e as imagens são estáticas em /santos — a home não depende do banco.
import { Cross } from "lucide-react"
import vitrine from "@/data/vitrine.json"

const VAGAS_VAZIAS = 1 // slots em aberto: conta a história do álbum incompleto

interface Santo {
  numero: number
  nome: string
  dataFesta: string
  arquivo: string
  bordaCor: string
  faixaCor: string
  nomeCor: string
  subtituloCor: string
  imgPosX: number
  imgPosY: number
  imgScale: number
}

function Figurinha({ s }: { s: Santo }) {
  return (
    <div
      title={`${String(s.numero).padStart(3, "0")} · ${s.nome}`}
      style={{
        aspectRatio: "49 / 65",
        border: `2.5px solid ${s.bordaCor}`,
        background: s.faixaCor,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 6px rgba(59,50,46,0.16)",
      }}
      className="arte-figurinha"
    >
      {/* selo do número */}
      <span
        style={{
          position: "absolute", top: 3, right: 3, zIndex: 2,
          width: 15, height: 15, borderRadius: "50%",
          background: "#F6EFDD", border: "1px solid #C9A24B",
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-arte-serif), Georgia, serif",
          fontSize: 7, fontWeight: 700, color: "#3B322E", lineHeight: 1,
        }}
      >
        {String(s.numero).padStart(3, "0")}
      </span>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.arquivo}
          alt={s.nome}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: `${s.imgPosX}% ${s.imgPosY}%`,
            transform: `scale(${s.imgScale})`,
          }}
        />
      </div>

      <div style={{
        background: s.faixaCor, borderTop: `1px solid ${s.bordaCor}`,
        padding: "2px 3px 3px", textAlign: "center",
      }}>
        <span style={{
          display: "block",
          fontFamily: "var(--font-arte-serif), Georgia, serif",
          fontSize: 6.5, fontWeight: 700, lineHeight: 1.1, color: s.nomeCor,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {s.nome}
        </span>
      </div>
    </div>
  )
}

function VagaVazia() {
  return (
    <div
      style={{
        aspectRatio: "49 / 65",
        border: "1.5px dashed var(--arte-line)",
        background: "rgba(59,50,46,0.03)",
        display: "grid",
        placeItems: "center",
        color: "rgba(59,50,46,0.22)",
      }}
    />
  )
}

export function AlbumVitrine() {
  const santos = vitrine as Santo[]
  const total = santos.length

  return (
    <div className="arte-card p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg">Coleção: Santos</h3>
        <span className="arte-tag arte-tag-hist">{total} figurinhas</span>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-2.5">
        {santos.map((s) => (
          <Figurinha key={s.numero} s={s} />
        ))}
        {Array.from({ length: VAGAS_VAZIAS }).map((_, i) => (
          <VagaVazia key={`vaga-${i}`} />
        ))}
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs" style={{ color: "var(--arte-ink-soft)" }}>
        <Cross size={12} style={{ color: "var(--arte-gold-deep)" }} />
        Coleção em crescimento — novos Santos a cada lançamento.
      </p>
    </div>
  )
}
