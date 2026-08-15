"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function PixCopia({ payload }: { payload: string }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(payload)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Fallback: seleciona o texto para cópia manual
      const el = document.getElementById("pix-payload") as HTMLTextAreaElement | null
      el?.select()
    }
  }

  return (
    <div>
      <textarea
        id="pix-payload"
        readOnly
        value={payload}
        rows={3}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full resize-none rounded-xl border px-3 py-2 text-xs"
        style={{ borderColor: "var(--arte-line)", background: "rgba(255,255,255,0.7)", color: "var(--arte-ink)", wordBreak: "break-all" }}
      />
      <button onClick={copiar} className="arte-btn arte-btn-primary mt-3 w-full">
        {copiado ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar código PIX</>}
      </button>
    </div>
  )
}
