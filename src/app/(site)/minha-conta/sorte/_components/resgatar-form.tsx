"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Gift, Loader2, PartyPopper, Sparkles } from "lucide-react"
import { resgatarCodigo, type ResgateResult } from "../_actions/sorte-actions"

type Voucher = Extract<ResgateResult, { ok: true; premiado: true }>["voucher"]
type Resultado = { tipo: "premio"; voucher: Voucher } | { tipo: "sem" }

export function ResgatarForm() {
  const router = useRouter()
  const [codigo, setCodigo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  async function tentar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    const res = await resgatarCodigo({ codigo })
    setEnviando(false)
    if (res.ok) {
      setResultado(res.premiado ? { tipo: "premio", voucher: res.voucher } : { tipo: "sem" })
      setCodigo("")
      router.refresh()
    } else {
      setErro(res.error)
    }
  }

  function reset() {
    setResultado(null)
    setErro(null)
  }

  if (resultado?.tipo === "sem") {
    return (
      <div className="text-center">
        <span className="arte-ic mx-auto" style={{ width: 56, height: 56, background: "rgba(0,0,0,0.05)", color: "var(--arte-ink-soft)" }}><Sparkles size={26} /></span>
        <h3 className="mt-4 text-2xl">Não foi dessa vez 🍀</h3>
        <p className="mt-1" style={{ color: "var(--arte-ink-soft)" }}>
          Este código não foi contemplado — mas cada nova caixa é uma nova chance. Continue tentando!
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/loja" className="arte-btn arte-btn-primary">Ver a loja</Link>
          <button onClick={reset} className="arte-btn arte-btn-ghost">Tentar outro código</button>
        </div>
      </div>
    )
  }

  if (resultado?.tipo === "premio") {
    const v = resultado.voucher
    const gratis = v.descontoPercent >= 100
    return (
      <div className="text-center">
        <span className="arte-ic arte-ic-gold mx-auto" style={{ width: 56, height: 56 }}>
          {gratis ? <Gift size={28} /> : <PartyPopper size={28} />}
        </span>
        <h3 className="mt-4 text-2xl">Parabéns! 🎉</h3>
        {gratis ? (
          <p className="mt-1 text-lg">
            Você ganhou um <strong style={{ color: "#3B6B4A" }}>quebra-cabeça grátis</strong>!
          </p>
        ) : (
          <p className="mt-1 text-lg">
            Você ganhou <strong style={{ color: "#3B6B4A" }}>{v.descontoPercent}% de desconto</strong>.
          </p>
        )}
        <p className="mt-1 text-sm" style={{ color: "var(--arte-ink-soft)" }}>
          Vale para qualquer Santo, exceto <strong>{v.santoExcluidoNome}</strong>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/loja" className="arte-btn arte-btn-primary">Usar na loja</Link>
          <button onClick={reset} className="arte-btn arte-btn-ghost">Resgatar outro código</button>
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
