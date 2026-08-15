// Leituras e tipos de Pedido — compartilhados por Server Components e actions.
// (sem "use server": funções de leitura importadas diretamente por páginas)
import { db } from "@/lib/prisma"
import type { PedidoStatus } from "@/generated/prisma"

export const STATUS_LABEL: Record<PedidoStatus, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  PAGO: "Pago",
  ENVIADO: "Enviado",
  CANCELADO: "Cancelado",
}

// Cores pastéis do tema do site.
export const STATUS_COR: Record<PedidoStatus, { bg: string; fg: string }> = {
  AGUARDANDO_PAGAMENTO: { bg: "rgba(228,203,144,0.28)", fg: "#8A6D1E" },
  PAGO: { bg: "rgba(150,190,160,0.30)", fg: "#3B6B4A" },
  ENVIADO: { bg: "rgba(169,193,217,0.32)", fg: "#3C5B7A" },
  CANCELADO: { bg: "rgba(190,140,140,0.28)", fg: "#8A4A47" },
}

export interface ItemPedidoView {
  id: string
  sku: string
  nome: string
  slug: string
  imagem: string | null
  precoCentavos: number
  qtd: number
}

export interface PedidoResumo {
  id: string
  numero: number
  status: PedidoStatus
  totalCentavos: number
  criadoEm: Date
  quantidadeItens: number
  // Só no admin:
  clienteNome?: string
  clienteEmail?: string | null
}

export interface PedidoDetalhe extends PedidoResumo {
  nomeCliente: string
  telefone: string
  cep: string | null
  endereco: string | null
  observacao: string | null
  subtotalCentavos: number
  descontoCentavos: number
  voucherCodigo: string | null
  pagoEm: Date | null
  enviadoEm: Date | null
  canceladoEm: Date | null
  clienteEmail: string | null
  itens: ItemPedidoView[]
}

function itensView(itens: {
  id: string; sku: string; nome: string; slug: string
  imagem: string | null; precoCentavos: number; qtd: number
}[]): ItemPedidoView[] {
  return itens.map((i) => ({
    id: i.id, sku: i.sku, nome: i.nome, slug: i.slug,
    imagem: i.imagem, precoCentavos: i.precoCentavos, qtd: i.qtd,
  }))
}

// ── Comprador ────────────────────────────────────────────

export async function listarMeusPedidos(userId: string): Promise<PedidoResumo[]> {
  const pedidos = await db.pedido.findMany({
    where: { userId },
    orderBy: { criadoEm: "desc" },
    include: { _count: { select: { itens: true } } },
  })
  return pedidos.map((p) => ({
    id: p.id, numero: p.numero, status: p.status,
    totalCentavos: p.totalCentavos, criadoEm: p.criadoEm,
    quantidadeItens: p._count.itens,
  }))
}

export async function obterMeuPedido(id: string, userId: string): Promise<PedidoDetalhe | null> {
  const p = await db.pedido.findUnique({
    where: { id },
    include: { itens: true, user: { select: { email: true } } },
  })
  if (!p || p.userId !== userId) return null
  return {
    id: p.id, numero: p.numero, status: p.status, totalCentavos: p.totalCentavos,
    criadoEm: p.criadoEm, quantidadeItens: p.itens.length,
    nomeCliente: p.nomeCliente, telefone: p.telefone, cep: p.cep,
    endereco: p.endereco, observacao: p.observacao,
    subtotalCentavos: p.subtotalCentavos, descontoCentavos: p.descontoCentavos,
    voucherCodigo: p.voucherCodigo,
    pagoEm: p.pagoEm, enviadoEm: p.enviadoEm, canceladoEm: p.canceladoEm,
    clienteEmail: p.user?.email ?? null,
    itens: itensView(p.itens),
  }
}

// ── Admin ────────────────────────────────────────────────

export async function listarPedidosAdmin(status?: PedidoStatus): Promise<PedidoResumo[]> {
  const pedidos = await db.pedido.findMany({
    where: status ? { status } : {},
    orderBy: { criadoEm: "desc" },
    include: {
      _count: { select: { itens: true } },
      user: { select: { name: true, email: true } },
    },
  })
  return pedidos.map((p) => ({
    id: p.id, numero: p.numero, status: p.status,
    totalCentavos: p.totalCentavos, criadoEm: p.criadoEm,
    quantidadeItens: p._count.itens,
    clienteNome: p.nomeCliente || p.user?.name || "—",
    clienteEmail: p.user?.email ?? null,
  }))
}

export async function obterPedidoAdmin(id: string): Promise<PedidoDetalhe | null> {
  const p = await db.pedido.findUnique({
    where: { id },
    include: { itens: true, user: { select: { name: true, email: true } } },
  })
  if (!p) return null
  return {
    id: p.id, numero: p.numero, status: p.status, totalCentavos: p.totalCentavos,
    criadoEm: p.criadoEm, quantidadeItens: p.itens.length,
    nomeCliente: p.nomeCliente, telefone: p.telefone, cep: p.cep,
    endereco: p.endereco, observacao: p.observacao,
    subtotalCentavos: p.subtotalCentavos, descontoCentavos: p.descontoCentavos,
    voucherCodigo: p.voucherCodigo,
    pagoEm: p.pagoEm, enviadoEm: p.enviadoEm, canceladoEm: p.canceladoEm,
    clienteNome: p.user?.name ?? undefined,
    clienteEmail: p.user?.email ?? null,
    itens: itensView(p.itens),
  }
}

export async function contarPedidosPorStatus(): Promise<Record<string, number>> {
  const grupos = await db.pedido.groupBy({ by: ["status"], _count: true })
  const mapa: Record<string, number> = {}
  for (const g of grupos) mapa[g.status] = g._count
  return mapa
}
