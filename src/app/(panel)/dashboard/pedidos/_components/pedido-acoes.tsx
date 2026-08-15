"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, RotateCcw, Truck, XCircle } from "lucide-react"
import type { PedidoStatus } from "@/generated/prisma"
import { marcarPago, marcarEnviado, cancelarPedido, reabrirPedido } from "../_actions/pedidos-admin-actions"

export function PedidoAcoes({ id, status }: { id: string; status: PedidoStatus }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [rotulo, setRotulo] = useState<string | null>(null)

  function executar(fn: (id: string) => Promise<{ ok: true }>, msg: string, nome: string) {
    setRotulo(nome)
    startTransition(async () => {
      await fn(id)
      toast.success(msg)
      router.refresh()
      setRotulo(null)
    })
  }

  const btn = "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"

  return (
    <div className="flex flex-wrap gap-2">
      {status === "AGUARDANDO_PAGAMENTO" && (
        <button
          className={`${btn} dash-btn-primary`}
          disabled={pending}
          onClick={() => executar(marcarPago, "Pagamento confirmado.", "pago")}
        >
          <CheckCircle2 size={16} /> {rotulo === "pago" ? "Confirmando…" : "Confirmar pagamento"}
        </button>
      )}

      {status === "PAGO" && (
        <button
          className={`${btn} dash-btn-primary`}
          disabled={pending}
          onClick={() => executar(marcarEnviado, "Pedido marcado como enviado.", "enviado")}
        >
          <Truck size={16} /> {rotulo === "enviado" ? "Salvando…" : "Marcar como enviado"}
        </button>
      )}

      {(status === "PAGO" || status === "ENVIADO" || status === "CANCELADO") && (
        <button
          className={btn}
          style={{ border: "1px solid rgba(0,0,0,0.12)", color: "#555" }}
          disabled={pending}
          onClick={() => executar(reabrirPedido, "Pedido reaberto (aguardando pagamento).", "reabrir")}
        >
          <RotateCcw size={16} /> {rotulo === "reabrir" ? "Reabrindo…" : "Reabrir"}
        </button>
      )}

      {status !== "CANCELADO" && (
        <button
          className={btn}
          style={{ border: "1px solid rgba(220,38,38,0.3)", color: "#dc2626" }}
          disabled={pending}
          onClick={() => {
            if (!confirm("Cancelar este pedido?")) return
            executar(cancelarPedido, "Pedido cancelado.", "cancelar")
          }}
        >
          <XCircle size={16} /> {rotulo === "cancelar" ? "Cancelando…" : "Cancelar"}
        </button>
      )}
    </div>
  )
}
