// Código da Sorte — geração/normalização de códigos e leituras compartilhadas.
// (sem "use server": usado por actions e Server Components)
import crypto from "crypto"
import { db } from "@/lib/prisma"

// Alfabeto sem caracteres ambíguos (sem 0/O, 1/I/L).
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
const GRUPOS = 4
const TAM_GRUPO = 4
const TAM_TOTAL = GRUPOS * TAM_GRUPO // 16

export const VALIDADE_VOUCHER_DIAS = 90
export const DESCONTO_MAX = 50

function sorteiaChars(qtd: number): string {
  let out = ""
  for (let i = 0; i < qtd; i++) out += ALFABETO[crypto.randomInt(0, ALFABETO.length)]
  return out
}

function comHifens(bruto: string): string {
  return bruto.match(/.{1,4}/g)?.join("-") ?? bruto
}

// Gera um código formatado XXXX-XXXX-XXXX-XXXX.
export function gerarCodigoBruto(): string {
  return comHifens(sorteiaChars(TAM_TOTAL))
}

// Normaliza entrada do usuário para a forma canônica; null se inválida.
export function normalizarCodigo(input: string): string | null {
  const limpo = input.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (limpo.length !== TAM_TOTAL) return null
  for (const ch of limpo) if (!ALFABETO.includes(ch)) return null
  return comHifens(limpo)
}

// Código curto de voucher: VC-XXXX-XXXX.
export function gerarCodigoVoucher(): string {
  return "VC-" + comHifens(sorteiaChars(8))
}

// Gera N códigos únicos (checa colisões no banco).
export async function gerarCodigosUnicos(quantidade: number): Promise<string[]> {
  const set = new Set<string>()
  while (set.size < quantidade) {
    // gera em blocos, depois remove os que já existem
    while (set.size < quantidade) set.add(gerarCodigoBruto())
    const candidatos = [...set]
    const existentes = await db.codigoSorte.findMany({
      where: { codigo: { in: candidatos } },
      select: { codigo: true },
    })
    for (const e of existentes) set.delete(e.codigo)
  }
  return [...set].slice(0, quantidade)
}

// ── Cálculo de desconto (puro) ───────────────────────────
// O voucher NÃO se aplica ao Santo da caixa (santoExcluidoId).

export interface DescontoCalc {
  subtotalCentavos: number
  elegivelCentavos: number
  descontoCentavos: number
}

export function calcularDescontoValor(
  itens: { precoCentavos: number; qtd: number; santoId: string | null }[],
  descontoPercent: number,
  santoExcluidoId: string,
): DescontoCalc {
  let subtotal = 0
  let elegivel = 0
  for (const i of itens) {
    const linha = i.precoCentavos * i.qtd
    subtotal += linha
    if (i.santoId !== santoExcluidoId) elegivel += linha
  }
  const desconto = Math.floor((elegivel * descontoPercent) / 100)
  return { subtotalCentavos: subtotal, elegivelCentavos: elegivel, descontoCentavos: desconto }
}

// ── Vouchers do comprador ────────────────────────────────

export interface VoucherView {
  id: string
  codigo: string
  descontoPercent: number
  santoExcluidoNome: string
  santoExcluidoId: string
  expiraEm: Date
  usado: boolean
  expirado: boolean
  disponivel: boolean
}

function toVoucherView(v: {
  id: string; codigo: string; descontoPercent: number
  santoExcluidoNome: string; santoExcluidoId: string
  expiraEm: Date; usado: boolean
}): VoucherView {
  const expirado = v.expiraEm.getTime() < Date.now()
  return {
    id: v.id, codigo: v.codigo, descontoPercent: v.descontoPercent,
    santoExcluidoNome: v.santoExcluidoNome, santoExcluidoId: v.santoExcluidoId,
    expiraEm: v.expiraEm, usado: v.usado, expirado,
    disponivel: !v.usado && !expirado,
  }
}

export async function listarMeusVouchers(userId: string): Promise<VoucherView[]> {
  const vs = await db.voucher.findMany({ where: { userId }, orderBy: { criadoEm: "desc" } })
  return vs.map(toVoucherView)
}

export async function listarMeusVouchersDisponiveis(userId: string): Promise<VoucherView[]> {
  const vs = await db.voucher.findMany({
    where: { userId, usado: false, expiraEm: { gt: new Date() } },
    orderBy: { descontoPercent: "desc" },
  })
  return vs.map(toVoucherView)
}

// ── Lotes (admin) ────────────────────────────────────────

export interface LoteResumo {
  lote: string
  santoNome: string
  total: number
  liberados: number
  resgatados: number
  criadoEm: Date
}

export async function listarLotesAdmin(): Promise<LoteResumo[]> {
  const [totais, liberadosG, resgatadosG, santos] = await Promise.all([
    db.codigoSorte.groupBy({ by: ["lote"], _count: { _all: true }, _min: { criadoEm: true } }),
    db.codigoSorte.groupBy({ by: ["lote"], where: { liberado: true }, _count: { _all: true } }),
    db.codigoSorte.groupBy({ by: ["lote"], where: { resgatado: true }, _count: { _all: true } }),
    db.codigoSorte.findMany({ distinct: ["lote"], select: { lote: true, santo: { select: { nome: true } } } }),
  ])
  const liberadosMap = new Map(liberadosG.map((g) => [g.lote, g._count._all]))
  const resgatadosMap = new Map(resgatadosG.map((g) => [g.lote, g._count._all]))
  const santoMap = new Map(santos.map((s) => [s.lote, s.santo?.nome ?? "—"]))

  return totais
    .map((t) => ({
      lote: t.lote,
      santoNome: santoMap.get(t.lote) ?? "—",
      total: t._count._all,
      liberados: liberadosMap.get(t.lote) ?? 0,
      resgatados: resgatadosMap.get(t.lote) ?? 0,
      criadoEm: t._min.criadoEm ?? new Date(0),
    }))
    .sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime())
}

export interface CodigoLinha {
  codigo: string
  descontoPercent: number
  liberado: boolean
  resgatado: boolean
}

export async function obterLoteCodigos(lote: string): Promise<{ santoNome: string; codigos: CodigoLinha[] } | null> {
  const codigos = await db.codigoSorte.findMany({
    where: { lote },
    orderBy: { codigo: "asc" },
    select: { codigo: true, descontoPercent: true, liberado: true, resgatado: true, santo: { select: { nome: true } } },
  })
  if (codigos.length === 0) return null
  return {
    santoNome: codigos[0].santo?.nome ?? "—",
    codigos: codigos.map((c) => ({
      codigo: c.codigo, descontoPercent: c.descontoPercent,
      liberado: c.liberado, resgatado: c.resgatado,
    })),
  }
}
