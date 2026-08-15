"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react"
import { gerarLote } from "../_actions/sorte-admin-actions"

interface SantoOpcao { id: string; nome: string; numero: number | null }
interface Faixa { descontoPercent: number; quantidade: number }

export function GerarLoteForm({ santos }: { santos: SantoOpcao[] }) {
  const router = useRouter()
  const [santoId, setSantoId] = useState("")
  const [lote, setLote] = useState("")
  const [liberarJa, setLiberarJa] = useState(false)
  const [faixas, setFaixas] = useState<Faixa[]>([{ descontoPercent: 10, quantidade: 50 }])
  const [salvando, setSalvando] = useState(false)

  const total = faixas.reduce((s, f) => s + (Number(f.quantidade) || 0), 0)

  function setFaixa(i: number, campo: keyof Faixa, valor: number) {
    setFaixas((prev) => prev.map((f, idx) => (idx === i ? { ...f, [campo]: valor } : f)))
  }
  function addFaixa() {
    setFaixas((prev) => [...prev, { descontoPercent: 20, quantidade: 20 }])
  }
  function removerFaixa(i: number) {
    setFaixas((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault()
    if (!santoId) { toast.error("Escolha o Santo da caixa."); return }
    setSalvando(true)
    const res = await gerarLote({
      santoId,
      lote,
      liberarJa,
      distribuicao: faixas.map((f) => ({ descontoPercent: Number(f.descontoPercent), quantidade: Number(f.quantidade) })),
    })
    setSalvando(false)
    if (res.ok) {
      toast.success(`Lote "${res.lote}" gerado: ${res.total} códigos.`)
      setLote("")
      setFaixas([{ descontoPercent: 10, quantidade: 50 }])
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  const inputCls = "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none dash-input"
  const inputStyle: React.CSSProperties = { borderColor: "rgba(0,0,0,0.14)", background: "#fff", color: "#1a1a1a" }

  return (
    <form onSubmit={submeter} className="dash-card p-5">
      <h2 className="dash-title font-semibold">Gerar novo lote</h2>

      <label className="mt-4 block">
        <span className="dash-title text-sm font-semibold">Santo da caixa *</span>
        <select value={santoId} onChange={(e) => setSantoId(e.target.value)} className={inputCls} style={inputStyle} required>
          <option value="">Selecione…</option>
          {santos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.numero != null ? `#${String(s.numero).padStart(3, "0")} — ` : ""}{s.nome}
            </option>
          ))}
        </select>
        <span className="dash-muted mt-1 block text-xs">O desconto do voucher NÃO vale para este Santo.</span>
      </label>

      <label className="mt-4 block">
        <span className="dash-title text-sm font-semibold">Rótulo do lote (opcional)</span>
        <input value={lote} onChange={(e) => setLote(e.target.value)} maxLength={60} className={inputCls} style={inputStyle} placeholder="deixe vazio p/ gerar automático" />
      </label>

      {/* Distribuição de prêmios */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="dash-title text-sm font-semibold">Tabela de prêmios</span>
          <button type="button" onClick={addFaixa} className="dash-muted inline-flex items-center gap-1 text-xs font-semibold hover:opacity-70">
            <Plus size={13} /> faixa
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {faixas.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input type="number" min={1} max={50} value={f.descontoPercent} onChange={(e) => setFaixa(i, "descontoPercent", +e.target.value)} className="w-16 rounded-lg border px-2 py-1.5 text-sm" style={inputStyle} />
                <span className="dash-muted text-sm">%</span>
              </div>
              <span className="dash-muted text-sm">×</span>
              <input type="number" min={1} max={5000} value={f.quantidade} onChange={(e) => setFaixa(i, "quantidade", +e.target.value)} className="w-24 rounded-lg border px-2 py-1.5 text-sm" style={inputStyle} />
              <span className="dash-muted text-sm">códigos</span>
              {faixas.length > 1 && (
                <button type="button" onClick={() => removerFaixa(i)} className="ml-auto rounded-lg p-1.5 hover:opacity-70" style={{ color: "#dc2626" }}><Trash2 size={14} /></button>
              )}
            </div>
          ))}
        </div>
        <p className="dash-muted mt-2 text-xs">Total: <strong>{total}</strong> código(s)</p>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={liberarJa} onChange={(e) => setLiberarJa(e.target.checked)} />
        <span className="dash-title">Já liberar (ativar) os códigos agora</span>
      </label>

      <button type="submit" disabled={salvando} className="dash-btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
        {salvando ? <><Loader2 size={16} className="animate-spin" /> Gerando…</> : <><Sparkles size={16} /> Gerar {total} código(s)</>}
      </button>
    </form>
  )
}
