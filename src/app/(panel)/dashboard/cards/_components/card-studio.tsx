"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Upload, Trash2, Download, Cross, Church, Sparkles, Info, Copy,
  Save, Loader2, ArrowLeft,
} from "lucide-react"
import "./card-studio.css"
import type { BordaEstilo, CardEstilo, CardRegistro } from "../_actions/cards-shared"
import { salvarCard } from "../_actions/cards-actions"

/* ─── Modelo do design em edição ─────────────────────────────── */
interface Design extends CardEstilo {
  numero: string
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
}

// Card novo em branco — padrão do print (moldura, selo de número, faixa creme).
const NOVO: Design = {
  numero: "",
  nome: "",
  dataFesta: "",
  descricao: "",
  imagem: null,
  frenteBg: "#EEE6D5",
  frenteBg2: "#E3D8C0",
  usarGradiente: false,
  faixaCor: "#F5ECD6",   // faixa creme
  nomeCor: "#2E2A26",    // tinta escura
  subtituloCor: "#3B322E", // cor da igrejinha + data
  brilho: false,
  holografico: false,
  bordaEstilo: "classica",
  bordaCor: "#2F5AA8",   // moldura (cor por card)
  bordaLargura: 10,
  versoBg: "#FBF6EC",
  versoTextoCor: "#2E2A26",
  acento: "#C9A24B",
}

const CARD_W = 260
const CARD_H = Math.round((CARD_W * 7) / 5) // proporção figurinha 5:7
const SERIF = "var(--font-arte-serif), Georgia, 'Times New Roman', serif"

function extrairEstilo(d: Design): CardEstilo {
  const { numero, nome, dataFesta, descricao, imagem, ...estilo } = d
  void numero; void nome; void dataFesta; void descricao; void imagem
  return estilo
}
function cardParaDesign(c: CardRegistro): Design {
  return {
    ...NOVO, ...c.estilo,
    numero: c.numero, nome: c.nome, dataFesta: c.dataFesta, descricao: c.descricao, imagem: c.imagem,
  }
}

export function CardStudio({ card }: { card?: CardRegistro | null }) {
  const router = useRouter()
  const cardId = card?.id ?? null
  const editando = !!cardId

  const [d, setD] = useState<Design>(card ? cardParaDesign(card) : NOVO)
  const [salvando, setSalvando] = useState(false)
  const [busy, setBusy] = useState(false)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  function set<K extends keyof Design>(k: K, v: Design[K]) {
    setD((prev) => ({ ...prev, [k]: v }))
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Envie um arquivo de imagem.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxW = 900
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0, w, h)
        set("imagem", canvas.toDataURL("image/jpeg", 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  async function salvar() {
    if (!d.nome.trim()) {
      toast.error("Dê um nome ao Santo antes de salvar.")
      return
    }
    setSalvando(true)
    try {
      const res = await salvarCard({
        id: cardId,
        numero: d.numero,
        nome: d.nome,
        dataFesta: d.dataFesta,
        descricao: d.descricao,
        imagem: d.imagem,
        estilo: extrairEstilo(d),
      })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(editando ? "Alterações salvas!" : "Card criado!")
      router.push("/dashboard/cards")
      router.refresh()
    } catch {
      toast.error("Erro ao salvar.")
    } finally {
      setSalvando(false)
    }
  }

  function bordaStyle(): React.CSSProperties {
    switch (d.bordaEstilo) {
      case "nenhuma": return {}
      case "solida": return { border: `${d.bordaLargura}px solid ${d.bordaCor}` }
      case "dupla": return { border: `${d.bordaLargura}px double ${d.bordaCor}` }
      case "classica": return {
        border: `${d.bordaLargura}px solid ${d.bordaCor}`,
        boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.35)`,
      }
    }
  }

  const frenteFundo = d.usarGradiente
    ? `linear-gradient(160deg, ${d.frenteBg}, ${d.frenteBg2})`
    : d.frenteBg

  async function exportar(ref: React.RefObject<HTMLDivElement | null>, nomeArq: string) {
    if (!ref.current) return
    setBusy(true)
    ref.current.classList.add("cardstudio-capturing")
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: null, useCORS: true, logging: false })
      const link = document.createElement("a")
      link.download = nomeArq
      link.href = canvas.toDataURL("image/png")
      link.click()
      toast.success("Imagem baixada!")
    } catch (err) {
      console.error(err)
      toast.error("Não foi possível exportar a imagem.")
    } finally {
      ref.current?.classList.remove("cardstudio-capturing")
      setBusy(false)
    }
  }

  const slug =
    d.nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "card"

  /* ─── FRENTE (padrão do print) ─── */
  const Frente = (
    <div ref={frontRef} style={{
      width: CARD_W, height: CARD_H, borderRadius: 12, overflow: "hidden",
      background: frenteFundo, position: "relative", display: "flex", flexDirection: "column", ...bordaStyle(),
    }}>
      {/* Selo do número */}
      {d.numero && (
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 4,
          width: 38, height: 38, borderRadius: "50%",
          background: "#F6EFDD", border: "2px solid #C9A24B",
          display: "grid", placeItems: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.28)",
        }}>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 15, color: "#3B322E", lineHeight: 1 }}>{d.numero}</span>
        </div>
      )}

      {/* Imagem */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {d.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.imagem} alt={d.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "grid", placeItems: "center",
            color: "rgba(59,50,46,0.35)", textAlign: "center", padding: 16,
            background: "repeating-linear-gradient(45deg, rgba(59,50,46,0.03) 0 10px, transparent 10px 20px)",
          }}>
            <div><Upload size={26} style={{ margin: "0 auto 8px" }} /><p style={{ fontSize: 12, fontWeight: 600 }}>Envie a imagem do Santo</p></div>
          </div>
        )}
      </div>

      {/* Faixa creme: nome + igrejinha + data */}
      <div className={`cardstudio-shine${d.holografico ? " cardstudio-holo" : ""}`} style={{
        background: d.faixaCor, borderTop: `2px solid ${d.bordaCor}`,
        display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", minHeight: 46,
      }}>
        <div style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 2, paddingLeft: 22 }}>
          <span style={{ fontFamily: SERIF, fontSize: 14.5, fontWeight: 700, color: d.nomeCor, lineHeight: 1.05, display: "block" }}>
            {d.nome || "Nome do Santo"}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, minWidth: 22 }}>
          <Church size={14} style={{ color: d.subtituloCor }} />
          {d.dataFesta && <span style={{ fontSize: 8.5, color: d.subtituloCor, marginTop: 1, fontWeight: 700 }}>{d.dataFesta}</span>}
        </div>
      </div>
    </div>
  )

  /* ─── VERSO ─── */
  const Verso = (
    <div ref={backRef} style={{
      width: CARD_W, height: CARD_H, borderRadius: 12, overflow: "hidden",
      background: d.versoBg, position: "relative", display: "flex", flexDirection: "column", padding: 18, ...bordaStyle(),
    }}>
      <div style={{ textAlign: "center" }}>
        <Cross size={18} style={{ color: d.acento, margin: "0 auto" }} />
        <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: d.versoTextoCor, marginTop: 6, lineHeight: 1.1 }}>
          {d.nome || "Nome do Santo"}
        </div>
        {d.numero && <div style={{ fontSize: 9, color: d.acento, fontWeight: 700, marginTop: 2 }}>Nº {d.numero}</div>}
        <div style={{ width: 46, height: 2, borderRadius: 2, background: d.acento, margin: "8px auto 0" }} />
      </div>
      <p style={{ flex: 1, marginTop: 12, fontSize: 11, lineHeight: 1.55, color: d.versoTextoCor, textAlign: "center", overflow: "hidden" }}>
        {d.descricao || "Descrição do Santo..."}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 9, color: d.acento, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        <Church size={11} /> {d.dataFesta || "Arte & Tradição"}
      </div>
    </div>
  )

  return (
    <div>
      {/* Cabeçalho + voltar */}
      <div className="mb-5">
        <Link href="/dashboard/cards" className="dash-muted mb-3 inline-flex items-center gap-1.5 text-sm hover:opacity-80">
          <ArrowLeft size={15} /> Voltar para a lista
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Sparkles size={14} /> Estúdio de Cards
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">{editando ? "Alterar card" : "Novo card"}</h1>
        <p className="dash-subtitle text-sm">Padrão figurinha: moldura, número, imagem e faixa com nome e data.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ─── CONTROLES ─── */}
        <div className="space-y-5">
          <Section title="Conteúdo">
            <div className="grid grid-cols-[90px_1fr] gap-3">
              <Field label="Número">
                <input className="dash-input" value={d.numero} onChange={(e) => set("numero", e.target.value)} placeholder="036" />
              </Field>
              <Field label="Nome do Santo">
                <input className="dash-input" value={d.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: Santa Teresa d'Ávila" />
              </Field>
            </div>
            <Field label="Data comemorativa (dia/mês)">
              <input className="dash-input" value={d.dataFesta} onChange={(e) => set("dataFesta", e.target.value)} placeholder="Ex.: 15/10" />
            </Field>
            <Field label="Descrição (verso)">
              <textarea className="dash-input" rows={4} value={d.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Uma descrição bonita do Santo..." style={{ resize: "vertical" }} />
            </Field>
          </Section>

          <Section title="Imagem do Santo">
            <div className="flex items-center gap-2">
              <label className="dash-btn-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm">
                <Upload size={15} /> Enviar imagem
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
              {d.imagem && (
                <button onClick={() => set("imagem", null)} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm" style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)" }}>
                  <Trash2 size={15} /> Remover
                </button>
              )}
            </div>
            <p className="dash-muted mt-2 text-xs">JPG ou PNG, de preferência vertical. É otimizada automaticamente ao enviar.</p>
          </Section>

          <Section title="Moldura">
            <Field label="Estilo da moldura">
              <select className="dash-input" value={d.bordaEstilo} onChange={(e) => set("bordaEstilo", e.target.value as BordaEstilo)}>
                <option value="classica">Clássica (linha interna)</option>
                <option value="solida">Sólida</option>
                <option value="dupla">Dupla</option>
                <option value="nenhuma">Sem moldura</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Cor da moldura" value={d.bordaCor} onChange={(v) => set("bordaCor", v)} />
              <Field label={`Espessura (${d.bordaLargura}px)`}>
                <input type="range" min={0} max={20} value={d.bordaLargura} onChange={(e) => set("bordaLargura", Number(e.target.value))} className="w-full" />
              </Field>
            </div>
          </Section>

          <Section title="Faixa do nome">
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Cor da faixa" value={d.faixaCor} onChange={(v) => set("faixaCor", v)} />
              <ColorField label="Cor do nome" value={d.nomeCor} onChange={(v) => set("nomeCor", v)} />
              <ColorField label="Cor da igrejinha + data" value={d.subtituloCor} onChange={(v) => set("subtituloCor", v)} />
            </div>
            <div className="mt-3 space-y-2">
              <Toggle label="Faixa com brilho (foil)" checked={d.brilho} onChange={(v) => set("brilho", v)} />
              <Toggle label="Efeito holográfico" checked={d.holografico} onChange={(v) => set("holografico", v)} />
            </div>
          </Section>

          <Section title="Fundo (aparece se não houver imagem) e verso">
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Fundo da frente" value={d.frenteBg} onChange={(v) => set("frenteBg", v)} />
              <ColorField label="Fundo (gradiente)" value={d.frenteBg2} onChange={(v) => set("frenteBg2", v)} disabled={!d.usarGradiente} />
              <ColorField label="Fundo do verso" value={d.versoBg} onChange={(v) => set("versoBg", v)} />
              <ColorField label="Cor do texto (verso)" value={d.versoTextoCor} onChange={(v) => set("versoTextoCor", v)} />
              <ColorField label="Cor de acento (verso)" value={d.acento} onChange={(v) => set("acento", v)} />
            </div>
            <div className="mt-3">
              <Toggle label="Fundo da frente em gradiente" checked={d.usarGradiente} onChange={(v) => set("usarGradiente", v)} />
            </div>
          </Section>
        </div>

        {/* ─── PREVIEW + AÇÕES ─── */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="dash-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="dash-label">Pré-visualização</span>
              <span className="dash-muted text-xs">5 × 7 cm · figurinha</span>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-5">
              <div className="text-center">{Frente}<p className="dash-muted mt-2 text-xs">Frente</p></div>
              <div className="text-center">{Verso}<p className="dash-muted mt-2 text-xs">Verso</p></div>
            </div>

            <button disabled={salvando} onClick={salvar}
              className="dash-btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60">
              {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editando ? "Salvar alterações" : "Salvar card"}
            </button>

            <div className="mt-4 flex items-start gap-2 rounded-xl p-3 text-xs" style={{ background: "rgba(201,162,75,0.10)", color: "#6B5F57" }}>
              <Copy size={14} style={{ color: "#A67C2E", marginTop: 1, flexShrink: 0 }} />
              <span>No jogo da memória, cada card é impresso <strong>em par</strong> (duas cópias iguais). A diagramação em folha A4 entra na próxima etapa.</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button disabled={busy} onClick={() => exportar(frontRef, `${slug}-frente.png`)} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm disabled:opacity-60" style={{ background: "rgba(0,0,0,0.05)", color: "inherit" }}>
                <Download size={15} /> PNG frente
              </button>
              <button disabled={busy} onClick={() => exportar(backRef, `${slug}-verso.png`)} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm disabled:opacity-60" style={{ background: "rgba(0,0,0,0.05)", color: "inherit" }}>
                <Download size={15} /> PNG verso
              </button>
            </div>

            <p className="dash-muted mt-3 flex items-start gap-1.5 text-[11px]">
              <Info size={12} style={{ marginTop: 1, flexShrink: 0 }} /> As alterações são gravadas no banco ao clicar em salvar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Subcomponentes ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dash-card p-5">
      <h3 className="dash-label mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="dash-muted mb-1 block text-xs font-medium">{label}</span>
      {children}
    </label>
  )
}
function ColorField({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label className={`block ${disabled ? "opacity-40" : ""}`}>
      <span className="dash-muted mb-1 block text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="cardstudio-color" style={{ width: 44, flexShrink: 0 }} />
        <input value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="dash-input" style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12 }} />
      </div>
    </label>
  )
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: checked ? "rgba(201,162,75,0.12)" : "rgba(0,0,0,0.03)" }}>
      <span className="dash-subtitle">{label}</span>
      <span style={{ width: 38, height: 22, borderRadius: 999, background: checked ? "#C9A24B" : "rgba(0,0,0,0.18)", position: "relative", transition: "background .2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
      </span>
    </button>
  )
}
