import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CheckCircle2, Clock, Package, QrCode, Truck, XCircle } from "lucide-react"
import { auth } from "@/lib/auth"
import { obterMeuPedido, STATUS_LABEL, STATUS_COR } from "@/lib/pedidos"
import { formatBRL } from "@/lib/money"
import { gerarPixCopiaCola, pixConfigurado } from "@/lib/pix"
import { gerarQrPng } from "@/lib/qr"
import { PixCopia } from "./_components/pix-copia"

export const metadata: Metadata = { title: "Pedido" }
export const dynamic = "force-dynamic"

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/login?callbackUrl=/loja/pedido/${id}`)

  const pedido = await obterMeuPedido(id, session.user.id)
  if (!pedido) notFound()

  const cor = STATUS_COR[pedido.status]
  const aguardando = pedido.status === "AGUARDANDO_PAGAMENTO"

  // PIX Copia-e-Cola (se as chaves estiverem configuradas no ambiente)
  const cfg = pixConfigurado()
  let pixPayload: string | null = null
  let pixQr: string | null = null
  if (aguardando && cfg) {
    pixPayload = gerarPixCopiaCola(cfg, pedido.totalCentavos, `AT${pedido.numero}`)
    pixQr = await gerarQrPng(pixPayload, 420)
  }

  const StatusIcon =
    pedido.status === "PAGO" ? CheckCircle2 :
    pedido.status === "ENVIADO" ? Truck :
    pedido.status === "CANCELADO" ? XCircle : Clock

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      {/* Cabeçalho */}
      <div className="text-center">
        <span className="arte-ic arte-ic-gold mx-auto"><CheckCircle2 size={26} /></span>
        <h1 className="mt-4 text-3xl sm:text-4xl">Pedido #{pedido.numero}</h1>
        <p className="mt-2" style={{ color: "var(--arte-ink-soft)" }}>
          Recebemos seu pedido. Guardamos ele na sua conta.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold" style={{ background: cor.bg, color: cor.fg }}>
          <StatusIcon size={15} /> {STATUS_LABEL[pedido.status]}
        </span>
      </div>

      {/* Pagamento PIX */}
      {aguardando && (
        <div className="arte-card mt-8 p-6">
          <span className="arte-eyebrow"><QrCode size={14} /> Pagamento via PIX</span>
          <h2 className="mt-1 text-2xl">Pague {formatBRL(pedido.totalCentavos)}</h2>

          {cfg && pixPayload ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
              <div style={{ width: 180, height: 180, background: "#fff", padding: 10, border: "1px solid var(--arte-line)", borderRadius: 14, margin: "0 auto" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pixQr!} alt="QR do PIX" style={{ width: "100%", height: "100%" }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--arte-ink-soft)" }}>
                  Escaneie o QR no app do seu banco ou use o <strong>Copia-e-Cola</strong> abaixo.
                  Recebedor: <strong>{cfg.nome}</strong>.
                </p>
                <div className="mt-3"><PixCopia payload={pixPayload} /></div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(228,203,144,0.2)", color: "#8A6D1E" }}>
              O PIX ainda não foi configurado pela loja. Assim que estiver ativo, o código aparecerá aqui.
              Você também pode combinar o pagamento pelo telefone informado.
            </div>
          )}

          <p className="mt-5 text-sm" style={{ color: "var(--arte-ink-soft)" }}>
            Após o pagamento, a confirmação é feita manualmente pela loja. Você acompanha o status
            em <Link href="/minha-conta/pedidos" className="font-semibold" style={{ color: "var(--arte-gold-deep)" }}>Meus pedidos</Link>.
          </p>
        </div>
      )}

      {pedido.status === "PAGO" && (
        <div className="arte-card mt-8 p-6 text-center">
          <p style={{ color: "#3B6B4A" }}>✓ Pagamento confirmado! Seu quebra-cabeça será preparado com carinho.</p>
        </div>
      )}
      {pedido.status === "ENVIADO" && (
        <div className="arte-card mt-8 p-6 text-center">
          <p style={{ color: "#3C5B7A" }}>📦 Pedido enviado! Em breve chega até você.</p>
        </div>
      )}

      {/* Itens */}
      <div className="arte-card mt-8 p-6">
        <h2 className="text-lg">Itens</h2>
        <div className="mt-4 space-y-3">
          {pedido.itens.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
                {it.imagem ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.imagem} alt={it.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : <Package size={18} style={{ color: "var(--arte-gold-deep)" }} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{it.nome}</p>
                <p className="text-xs" style={{ color: "var(--arte-ink-soft)" }}>{it.qtd} × {formatBRL(it.precoCentavos)}</p>
              </div>
              <span className="font-semibold">{formatBRL(it.precoCentavos * it.qtd)}</span>
            </div>
          ))}
        </div>
        <hr className="arte-rule my-4" />
        {pedido.descontoCentavos > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--arte-ink-soft)" }}>Subtotal</span>
              <span>{formatBRL(pedido.subtotalCentavos)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span style={{ color: "#3B6B4A" }}>Desconto {pedido.voucherCodigo ? `(${pedido.voucherCodigo})` : ""}</span>
              <span style={{ color: "#3B6B4A" }}>− {formatBRL(pedido.descontoCentavos)}</span>
            </div>
          </>
        )}
        <div className="mt-2 flex items-center justify-between text-lg">
          <span>Total</span>
          <strong style={{ color: "var(--arte-gold-deep)" }}>{formatBRL(pedido.totalCentavos)}</strong>
        </div>
      </div>

      {/* Entrega */}
      <div className="arte-card mt-6 p-6">
        <h2 className="text-lg">Entrega</h2>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2"><dt style={{ color: "var(--arte-ink-soft)" }}>Nome:</dt><dd>{pedido.nomeCliente}</dd></div>
          <div className="flex gap-2"><dt style={{ color: "var(--arte-ink-soft)" }}>Telefone:</dt><dd>{pedido.telefone}</dd></div>
          {pedido.cep && <div className="flex gap-2"><dt style={{ color: "var(--arte-ink-soft)" }}>CEP:</dt><dd>{pedido.cep}</dd></div>}
          {pedido.endereco && <div className="flex gap-2"><dt style={{ color: "var(--arte-ink-soft)" }}>Endereço:</dt><dd className="whitespace-pre-line">{pedido.endereco}</dd></div>}
          {pedido.observacao && <div className="flex gap-2"><dt style={{ color: "var(--arte-ink-soft)" }}>Obs.:</dt><dd className="whitespace-pre-line">{pedido.observacao}</dd></div>}
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/minha-conta/pedidos" className="arte-btn arte-btn-ghost">Meus pedidos</Link>
        <Link href="/loja" className="arte-btn arte-btn-primary">Continuar comprando</Link>
      </div>
    </div>
  )
}
