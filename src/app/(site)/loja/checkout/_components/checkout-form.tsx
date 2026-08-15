"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Package, ShoppingCart, Ticket } from "lucide-react"
import { useCarrinho } from "../../../_components/cart/cart-context"
import { formatBRL } from "@/lib/money"
import { criarPedido, calcularDescontoVoucher } from "../_actions/checkout-actions"

interface VoucherOpcao {
  codigo: string
  descontoPercent: number
  santoExcluidoNome: string
}

export function CheckoutForm({
  defaultNome,
  email,
  vouchers,
}: {
  defaultNome: string
  email: string
  vouchers: VoucherOpcao[]
}) {
  const router = useRouter()
  const { itens, totalCentavos, limpar, pronto } = useCarrinho()

  const [nome, setNome] = useState(defaultNome)
  const [telefone, setTelefone] = useState("")
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")
  const [observacao, setObservacao] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Voucher
  const [voucherSel, setVoucherSel] = useState("")
  const [descontoCentavos, setDescontoCentavos] = useState(0)
  const [voucherErro, setVoucherErro] = useState<string | null>(null)
  const [checandoVoucher, setChecandoVoucher] = useState(false)

  async function aplicarVoucher(codigo: string) {
    setVoucherSel(codigo)
    setVoucherErro(null)
    setDescontoCentavos(0)
    if (!codigo) return
    setChecandoVoucher(true)
    const res = await calcularDescontoVoucher({
      itens: itens.map((i) => ({ produtoId: i.produtoId, qtd: i.qtd })),
      voucherCodigo: codigo,
    })
    setChecandoVoucher(false)
    if (res.ok) {
      setDescontoCentavos(res.descontoCentavos)
    } else {
      setDescontoCentavos(0)
      setVoucherErro(res.error)
    }
  }

  if (!pronto) return null

  if (itens.length === 0) {
    return (
      <div className="arte-card mt-8 p-10 text-center">
        <span className="arte-ic arte-ic-gold mx-auto"><ShoppingCart size={26} /></span>
        <p className="mt-4">Seu carrinho está vazio.</p>
        <Link href="/loja" className="arte-btn arte-btn-primary mt-5">Ver a loja</Link>
      </div>
    )
  }

  async function finalizar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    const res = await criarPedido({
      itens: itens.map((i) => ({ produtoId: i.produtoId, qtd: i.qtd })),
      nomeCliente: nome,
      telefone,
      cep,
      endereco,
      observacao,
      voucherCodigo: descontoCentavos > 0 ? voucherSel : "",
    })
    if (res.ok) {
      limpar()
      router.push(`/loja/pedido/${res.id}`)
    } else {
      setErro(res.error)
      setEnviando(false)
    }
  }

  const inputCls = "mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none"
  const inputStyle: React.CSSProperties = { borderColor: "var(--arte-line)", background: "rgba(255,255,255,0.6)", color: "var(--arte-ink)" }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,320px)]">
      {/* Formulário */}
      <form onSubmit={finalizar} className="order-2 lg:order-1">
        <div className="arte-card p-6">
          <h2 className="text-xl">Dados para entrega</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--arte-ink-soft)" }}>Conta: {email}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Nome completo *</span>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={120} className={inputCls} style={inputStyle} placeholder="Seu nome" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Telefone / WhatsApp *</span>
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)} required maxLength={30} className={inputCls} style={inputStyle} placeholder="(00) 00000-0000" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">CEP</span>
              <input value={cep} onChange={(e) => setCep(e.target.value)} maxLength={12} className={inputCls} style={inputStyle} placeholder="00000-000" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Endereço de entrega</span>
              <textarea value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength={600} rows={3} className={inputCls} style={inputStyle} placeholder="Rua, número, complemento, bairro, cidade/UF" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Observação (opcional)</span>
              <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} maxLength={600} rows={2} className={inputCls} style={inputStyle} placeholder="Alguma preferência ou recado?" />
            </label>
          </div>

          {erro && (
            <p className="mt-4 rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(190,140,140,0.18)", color: "#8A4A47" }}>{erro}</p>
          )}

          <button type="submit" disabled={enviando} className="arte-btn arte-btn-primary mt-6 w-full disabled:opacity-60">
            {enviando ? <><Loader2 size={16} className="animate-spin" /> Gerando pedido…</> : <>Gerar pedido e PIX</>}
          </button>
          <p className="mt-2 text-center text-xs" style={{ color: "var(--arte-ink-soft)" }}>
            Após confirmar, mostramos o PIX Copia-e-Cola com o valor exato.
          </p>
        </div>
      </form>

      {/* Resumo */}
      <aside className="order-1 lg:order-2">
        <div className="arte-card p-6 lg:sticky lg:top-24">
          <h2 className="text-lg">Seu pedido</h2>
          <div className="mt-4 space-y-3">
            {itens.map((it) => (
              <div key={it.produtoId} className="flex items-center gap-3">
                <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
                  {it.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.imagem} alt={it.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : <Package size={16} style={{ color: "var(--arte-gold-deep)" }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{it.nome}</p>
                  <p className="text-xs" style={{ color: "var(--arte-ink-soft)" }}>{it.qtd} × {formatBRL(it.precoCentavos)}</p>
                </div>
                <span className="text-sm font-semibold">{formatBRL(it.precoCentavos * it.qtd)}</span>
              </div>
            ))}
          </div>
          {/* Voucher */}
          {vouchers.length > 0 && (
            <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "var(--arte-line)", background: "rgba(228,203,144,0.12)" }}>
              <label className="flex items-center gap-1.5 text-sm font-semibold">
                <Ticket size={15} style={{ color: "var(--arte-gold-deep)" }} /> Usar voucher da sorte
              </label>
              <select
                value={voucherSel}
                onChange={(e) => aplicarVoucher(e.target.value)}
                disabled={checandoVoucher}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--arte-line)", background: "#fff", color: "var(--arte-ink)" }}
              >
                <option value="">Nenhum</option>
                {vouchers.map((v) => (
                  <option key={v.codigo} value={v.codigo}>
                    {v.descontoPercent}% — exceto {v.santoExcluidoNome} ({v.codigo})
                  </option>
                ))}
              </select>
              {checandoVoucher && <p className="mt-1 text-xs" style={{ color: "var(--arte-ink-soft)" }}>Calculando…</p>}
              {voucherErro && <p className="mt-1 text-xs" style={{ color: "#8A4A47" }}>{voucherErro}</p>}
            </div>
          )}

          <hr className="arte-rule my-4" />
          {descontoCentavos > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--arte-ink-soft)" }}>Subtotal</span>
                <span>{formatBRL(totalCentavos)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span style={{ color: "#3B6B4A" }}>Desconto</span>
                <span style={{ color: "#3B6B4A" }}>− {formatBRL(descontoCentavos)}</span>
              </div>
            </>
          )}
          <div className="mt-2 flex items-center justify-between text-lg">
            <span>Total</span>
            <strong style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(Math.max(0, totalCentavos - descontoCentavos))}</strong>
          </div>
        </div>
      </aside>
    </div>
  )
}
