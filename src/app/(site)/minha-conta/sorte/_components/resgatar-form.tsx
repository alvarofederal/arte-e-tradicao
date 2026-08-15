"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, PartyPopper, Sparkles } from "lucide-react"
import { resgatarCodigo, type ResgateResult } from "../_actions/sorte-actions"

export function ResgatarForm() {
  const router = useRouter()
  const [codigo, setCodigo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [premio, setPremio] = useState<Extract<ResgateResult, { ok: true }>["voucher"] | null>(null)

  async function tentar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    const res = await resgatarCodigo({ codigo })
    setEnviando(false)
    if (res.ok) {
      setPremio(res.voucher)
      setCodigo("")
      router.refresh()
    } else {
      setErro(res.error)
    }
  }

  if (premio) {
    return (
      <div className="text-center">
        <span className="arte-ic arte-ic-gold mx-auto" style={{ width: 56, height: 56 }}><PartyPopper size={28} /></span>
        <h3 className="mt-4 text-2xl">Parabéns! 🎉</h3>
        <p className="mt-1 text-lg">
          Você ganhou <strong style={{ color: "#3B6B4A" }}>{premio.descontoPercent}% de desconto</strong>.
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--arte-ink-soft)" }}>
          Vale para qualquer Santo, exceto <strong>{premio.santoExcluidoNome}</strong>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/loja" className="arte-btn arte-btn-primary">Usar na loja</Link>
          <button onClick={() => setPremio(null)} className="arte-btn arte-btn-ghost">Resgatar outro código</button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={tentar}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          maxLength={19}
          autoComplete="off"
          className="flex-1 rounded-xl border px-4 py-3 text-center font-mono text-lg tracking-[0.15em] outline-none"
          style={{ borderColor: "var(--arte-line)", background: "rgba(255,255,255,0.7)", color: "var(--arte-ink)" }}
        />
        <button type="submit" disabled={enviando} className="arte-btn arte-btn-primary disabled:opacity-60">
          {enviando ? <><Loader2 size={16} className="animate-spin" /> Verificando…</> : <><Sparkles size={16} /> Tentar a sorte</>}
        </button>
      </div>
      {erro && <p className="mt-3 text-sm" style={{ color: "#8A4A47" }}>{erro}</p>}
    </form>
  )
}
