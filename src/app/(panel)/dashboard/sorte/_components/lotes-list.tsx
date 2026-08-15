"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, Download, Lock, Package, Unlock } from "lucide-react"
import type { LoteResumo } from "@/lib/codigo-sorte"
import { liberarLote, bloquearLote, exportarLoteCSV } from "../_actions/sorte-admin-actions"

function dataBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d))
}

export function LotesList({ lotes }: { lotes: LoteResumo[] }) {
  const router = useRouter()
  const [ocupado, setOcupado] = useState<string | null>(null)

  async function toggle(l: LoteResumo) {
    setOcupado(l.lote)
    const liberarTudo = l.liberados < l.total
    const res = liberarTudo ? await liberarLote(l.lote) : await bloquearLote(l.lote)
    setOcupado(null)
    if (res.ok) {
      toast.success(liberarTudo ? "Lote liberado." : "Lote bloqueado.")
      router.refresh()
    } else {
      toast.error("Não foi possível atualizar o lote.")
    }
  }

  async function baixar(l: LoteResumo) {
    setOcupado(l.lote)
    const res = await exportarLoteCSV(l.lote)
    setOcupado(null)
    if (!res.ok) { toast.error("Não foi possível exportar."); return }
    const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = res.nome
    a.click()
    URL.revokeObjectURL(url)
  }

  if (lotes.length === 0) {
    return (
      <div className="dash-card flex flex-col items-center gap-3 p-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
          <Package size={26} />
        </span>
        <h3 className="dash-title text-lg font-semibold">Nenhum lote ainda</h3>
        <p className="dash-subtitle max-w-sm text-sm">Gere seu primeiro lote de códigos ao lado. Depois exporte o CSV para imprimir nas embalagens.</p>
      </div>
    )
  }

  return (
    <div className="dash-card overflow-hidden">
      <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        {lotes.map((l) => {
          const totalmenteLiberado = l.liberados >= l.total
          return (
            <div key={l.lote} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="dash-title truncate text-sm font-semibold" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>{l.lote}</span>
                  {totalmenteLiberado
                    ? <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(150,190,160,0.3)", color: "#3B6B4A" }}><CheckCircle2 size={11} /> liberado</span>
                    : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(0,0,0,0.06)", color: "#777" }}><Lock size={11} /> inativo</span>}
                </div>
                <p className="dash-muted truncate text-xs">
                  {l.santoNome} · {l.total} códigos · {l.resgatados} resgatado(s) · {dataBR(l.criadoEm)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => baixar(l)} disabled={ocupado === l.lote} className="rounded-lg p-2 hover:opacity-70 disabled:opacity-40" style={{ color: "#A67C2E" }} title="Exportar CSV">
                  <Download size={16} />
                </button>
                <button onClick={() => toggle(l)} disabled={ocupado === l.lote} className="rounded-lg p-2 hover:opacity-70 disabled:opacity-40" style={{ color: totalmenteLiberado ? "#777" : "#3B6B4A" }} title={totalmenteLiberado ? "Bloquear" : "Liberar"}>
                  {totalmenteLiberado ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
