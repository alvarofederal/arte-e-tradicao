"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Upload, Trash2, Download, Sparkles, Info, Copy,
  Save, Loader2, ArrowLeft, Printer, Crosshair,
} from "lucide-react"
import "./card-studio.css"
import type { BordaEstilo, CardEstilo, CardRegistro } from "../_actions/cards-shared"
import { formatarNumero, enquadramentoInicial } from "../_actions/cards-shared"
import { salvarCard } from "../_actions/cards-actions"

const SERIF_UI = "var(--font-geist-mono), ui-monospace, monospace"
import { CardFace } from "./card-faces"

interface Design extends CardEstilo {
  numero: number | null // atribuído pelo servidor (global, permanente)
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
}

const NOVO: Design = {
  numero: null, nome: "", dataFesta: "", descricao: "", imagem: null,
  frenteBg: "#EEE6D5", frenteBg2: "#E3D8C0", usarGradiente: false,
  faixaCor: "#F5ECD6", nomeCor: "#2E2A26", subtituloCor: "#3B322E",
  brilho: false, holografico: false,
  bordaEstilo: "classica", bordaCor: "#2F5AA8", bordaLargura: 10,
  versoBg: "#FBF6EC", versoTextoCor: "#2E2A26", acento: "#C9A24B",
  imgScale: 1, imgPosX: 50, imgPosY: 50,
}

const CARD_W = 260

function extrairEstilo(d: Design): CardEstilo {
  const { numero, nome, dataFesta, descricao, imagem, ...estilo } = d
  void numero; void nome; void dataFesta; void descricao; void imagem
  return estilo
}
function cardParaDesign(c: CardRegistro): Design {
  return { ...NOVO, ...c.estilo, numero: c.numero, nome: c.nome, dataFesta: c.dataFesta, descricao: c.descricao, imagem: c.imagem }
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
        const maxW = 1400
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0, w, h)
        // enquadra preservando o topo (rosto), em vez de centralizar
        const posY = enquadramentoInicial(w, h)
        setD((prev) => ({ ...prev, imagem: canvas.toDataURL("image/jpeg", 0.86), imgScale: 1, imgPosX: 50, imgPosY: posY }))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  function payload() {
    return {
      id: cardId, numero: d.numero, nome: d.nome, dataFesta: d.dataFesta,
      descricao: d.descricao, imagem: d.imagem, estilo: extrairEstilo(d),
    }
  }

  async function salvar() {
    if (!d.nome.trim()) { toast.error("Dê um nome ao Santo antes de salvar."); return }
    setSalvando(true)
    try {
      const res = await salvarCard(payload())
      if (!res.ok) { toast.error(res.error); return }
      toast.success(editando ? "Alterações salvas!" : "Card criado!")
      router.push("/dashboard/cards")
      router.refresh()
    } catch { toast.error("Erro ao salvar.") }
    finally { setSalvando(false) }
  }

  async function imprimir() {
    if (!d.nome.trim()) { toast.error("Dê um nome ao Santo antes de imprimir."); return }
    setSalvando(true)
    try {
      const res = await salvarCard(payload())
      if (!res.ok) { toast.error(res.error); return }
      // Folha de produção: frente e verso em páginas separadas e espelhadas (duplex).
      router.push(`/print/folha?modo=colecionavel&ids=${res.card.id}`)
    } catch { toast.error("Erro ao abrir a prévia.") }
    finally { setSalvando(false) }
  }

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

  return (
    <div>
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
            <div className="grid grid-cols-[104px_1fr] gap-3">
              <Field label="Número">
                <input
                  className="dash-input text-center"
                  inputMode="numeric"
                  style={{ fontFamily: SERIF_UI, fontWeight: 700, letterSpacing: "0.04em" }}
                  value={d.numero ?? ""}
                  onChange={(e) => {
                    const so = e.target.value.replace(/\D/g, "")
                    set("numero", so === "" ? null : parseInt(so, 10))
                  }}
                  placeholder="auto"
                  title="Número global do catálogo — único por card"
                />
              </Field>
              <Field label="Nome do Santo">
                <input className="dash-input" value={d.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: Santa Teresa d'Ávila" />
              </Field>
            </div>
            <p className="dash-muted -mt-1 text-xs">
              {d.numero == null
                ? "Em branco, o próximo número da sequência é atribuído ao salvar."
                : `Sai no card como ${formatarNumero(d.numero)}. O número é único — dois cards não podem repetir.`}
            </p>
            <Field label="Data comemorativa (dia/mês/ano)">
              <input className="dash-input" value={d.dataFesta} onChange={(e) => set("dataFesta", e.target.value)} placeholder="Ex.: 15/10/1582" />
            </Field>
            <Field label="Descrição (verso)">
              <textarea className="dash-input" rows={4} value={d.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Uma descrição bonita do Santo..." style={{ resize: "vertical" }} />
            </Field>
          </Section>

          {d.imagem && (
            <Section title="Enquadramento da imagem">
              <p className="dash-muted -mt-1 mb-1 text-xs">Ajuste para o Santo ficar bem posicionado no card.</p>
              <Field label={`Zoom (${d.imgScale.toFixed(2)}×)`}>
                <input type="range" min={0.5} max={3} step={0.02} value={d.imgScale} onChange={(e) => set("imgScale", Number(e.target.value))} className="w-full" />
              </Field>
              <Field label={`Posição horizontal (${Math.round(d.imgPosX)}%)`}>
                <input type="range" min={0} max={100} value={d.imgPosX} onChange={(e) => set("imgPosX", Number(e.target.value))} className="w-full" />
              </Field>
              <Field label={`Posição vertical (${Math.round(d.imgPosY)}%)`}>
                <input type="range" min={0} max={100} value={d.imgPosY} onChange={(e) => set("imgPosY", Number(e.target.value))} className="w-full" />
              </Field>
              <button onClick={() => setD((p) => ({ ...p, imgScale: 1, imgPosX: 50, imgPosY: 50 }))} className="dash-muted inline-flex items-center gap-1.5 text-xs hover:opacity-80">
                <Crosshair size={13} /> Recentralizar
              </button>
            </Section>
          )}

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

          <Section title="Fundo (se não houver imagem) e verso">
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
              <span className="dash-muted text-xs">4,9 × 6,5 cm · figurinha</span>
            </div>

            {/* Upload logo acima da prévia — envia e já vê o resultado */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <label className="dash-btn-primary inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
                  <Upload size={15} /> {d.imagem ? "Trocar imagem" : "Enviar imagem"}
                  <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                </label>
                {d.imagem && (
                  <button onClick={() => set("imagem", null)} title="Remover imagem"
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm"
                    style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)" }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <p className="dash-muted mt-1.5 text-xs">JPG ou PNG, de preferência vertical. É otimizada automaticamente.</p>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-5">
              <div className="text-center">
                <CardFace ref={frontRef} view={d} side="front" width={CARD_W} />
                <p className="dash-muted mt-2 text-xs">Frente</p>
              </div>
              <div className="text-center">
                <CardFace ref={backRef} view={d} side="back" width={CARD_W} />
                <p className="dash-muted mt-2 text-xs">Verso</p>
              </div>
            </div>

            <button disabled={salvando} onClick={salvar}
              className="dash-btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60">
              {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editando ? "Salvar alterações" : "Salvar card"}
            </button>

            <button disabled={salvando} onClick={imprimir}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
              <Printer size={16} /> Prévia de impressão (A4)
            </button>

            <div className="mt-4 flex items-start gap-2 rounded-xl p-3 text-xs" style={{ background: "rgba(201,162,75,0.10)", color: "#6B5F57" }}>
              <Copy size={14} style={{ color: "#A67C2E", marginTop: 1, flexShrink: 0 }} />
              <span>A prévia salva o card e mostra a <strong>frente e o verso</strong> prontos para imprimir em folha A4.</span>
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
              <Info size={12} style={{ marginTop: 1, flexShrink: 0 }} /> As alterações são gravadas no banco ao salvar ou imprimir.
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
