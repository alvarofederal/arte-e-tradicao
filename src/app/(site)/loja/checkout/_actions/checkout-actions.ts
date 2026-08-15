"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { calcularDescontoValor } from "@/lib/codigo-sorte"

const itensSchema = z
  .array(
    z.object({
      produtoId: z.string().min(1),
      qtd: z.number().int().min(1).max(99),
    }),
  )
  .min(1, "Seu carrinho está vazio.")

const schema = z.object({
  itens: itensSchema,
  nomeCliente: z.string().trim().min(2, "Informe seu nome.").max(120),
  telefone: z.string().trim().min(8, "Informe um telefone/WhatsApp.").max(30),
  cep: z.string().trim().max(12).optional().default(""),
  endereco: z.string().trim().max(600).optional().default(""),
  observacao: z.string().trim().max(600).optional().default(""),
  voucherCodigo: z.string().trim().max(40).optional().default(""),
})

export type CriarPedidoInput = z.input<typeof schema>
export type CriarPedidoResult =
  | { ok: true; id: string; numero: number }
  | { ok: false; error: string }

// Carrega itens autoritativos do banco (preço + santo) a partir do carrinho.
async function carregarItens(itens: { produtoId: string; qtd: number }[]) {
  const ids = [...new Set(itens.map((i) => i.produtoId))]
  const produtos = await db.produto.findMany({
    where: { id: { in: ids } },
    include: { santo: { select: { imagem: true } } },
  })
  const porId = new Map(produtos.map((p) => [p.id, p]))

  const linhas: {
    produtoId: string; sku: string; nome: string; slug: string
    imagem: string | null; precoCentavos: number; qtd: number
    santoId: string | null; estoque: number
  }[] = []
  for (const item of itens) {
    const p = porId.get(item.produtoId)
    if (!p || !p.ativo) return null
    linhas.push({
      produtoId: p.id, sku: p.sku, nome: p.nome, slug: p.slug,
      imagem: p.imagem || p.santo?.imagem || null,
      precoCentavos: p.precoCentavos, qtd: item.qtd, santoId: p.santoId,
      estoque: p.estoque,
    })
  }
  return linhas
}

// Busca um voucher válido do usuário atual (ou null).
async function voucherValido(userId: string, codigo: string) {
  if (!codigo) return null
  const v = await db.voucher.findUnique({ where: { codigo } })
  if (!v || v.userId !== userId || v.usado || v.expiraEm.getTime() < Date.now()) return null
  return v
}

// ── Preview de desconto (chamado pelo formulário ao escolher o voucher) ──
export type DescontoPreview =
  | { ok: true; subtotalCentavos: number; descontoCentavos: number; totalCentavos: number }
  | { ok: false; error: string }

export async function calcularDescontoVoucher(input: {
  itens: { produtoId: string; qtd: number }[]
  voucherCodigo: string
}): Promise<DescontoPreview> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: "Faça login." }

  const parsedItens = itensSchema.safeParse(input.itens)
  if (!parsedItens.success) return { ok: false, error: "Carrinho inválido." }

  const linhas = await carregarItens(parsedItens.data)
  if (!linhas) return { ok: false, error: "Há um produto indisponível no carrinho." }

  const voucher = await voucherValido(session.user.id, input.voucherCodigo.trim())
  if (!voucher) return { ok: false, error: "Voucher inválido ou expirado." }

  const calc = calcularDescontoValor(linhas, voucher.descontoPercent, voucher.santoExcluidoId)
  if (calc.descontoCentavos <= 0) {
    return { ok: false, error: `Este voucher não vale para ${voucher.santoExcluidoNome}. Adicione outro Santo.` }
  }
  return {
    ok: true,
    subtotalCentavos: calc.subtotalCentavos,
    descontoCentavos: calc.descontoCentavos,
    totalCentavos: calc.subtotalCentavos - calc.descontoCentavos,
  }
}

// ── Criação do pedido ────────────────────────────────────
export async function criarPedido(input: CriarPedidoInput): Promise<CriarPedidoResult> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: "Faça login para finalizar a compra." }
  const userId = session.user.id

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }
  const v = parsed.data

  const linhas = await carregarItens(v.itens)
  if (!linhas) return { ok: false, error: "Um dos produtos ficou indisponível. Revise o carrinho." }

  // Estoque — checagem amigável antes de gravar (a baixa definitiva é atômica, abaixo).
  const semEstoque = linhas.find((l) => l.qtd > l.estoque)
  if (semEstoque) {
    return {
      ok: false,
      error:
        semEstoque.estoque > 0
          ? `Estoque insuficiente para "${semEstoque.nome}" (restam ${semEstoque.estoque}).`
          : `"${semEstoque.nome}" está esgotado. Remova-o do carrinho.`,
    }
  }

  const subtotalCentavos = linhas.reduce((s, i) => s + i.precoCentavos * i.qtd, 0)
  if (subtotalCentavos <= 0) return { ok: false, error: "Valor total inválido." }

  // Voucher (opcional)
  let descontoCentavos = 0
  let voucher: Awaited<ReturnType<typeof voucherValido>> = null
  if (v.voucherCodigo) {
    voucher = await voucherValido(userId, v.voucherCodigo)
    if (!voucher) return { ok: false, error: "O voucher não é mais válido. Remova-o e tente novamente." }
    const calc = calcularDescontoValor(linhas, voucher.descontoPercent, voucher.santoExcluidoId)
    descontoCentavos = calc.descontoCentavos
    if (descontoCentavos <= 0) {
      return { ok: false, error: `Este voucher não vale para ${voucher.santoExcluidoNome}.` }
    }
  }

  const totalCentavos = subtotalCentavos - descontoCentavos

  try {
    const pedido = await db.$transaction(async (tx) => {
      const ultimo = await tx.pedido.findFirst({
        orderBy: { numero: "desc" },
        select: { numero: true },
      })
      const numero = (ultimo?.numero ?? 1000) + 1 // pedidos começam em #1001

      // Baixa de estoque atômica e segura (impede venda além do disponível).
      for (const l of linhas) {
        const upd = await tx.produto.updateMany({
          where: { id: l.produtoId, estoque: { gte: l.qtd } },
          data: { estoque: { decrement: l.qtd } },
        })
        if (upd.count === 0) throw new Error(`ESTOQUE:${l.nome}`)
      }

      // Total zero (prêmio grátis) já entra como PAGO — nada a pagar.
      const gratis = totalCentavos === 0

      const criado = await tx.pedido.create({
        data: {
          numero,
          userId,
          status: gratis ? "PAGO" : "AGUARDANDO_PAGAMENTO",
          pagoEm: gratis ? new Date() : null,
          subtotalCentavos,
          descontoCentavos,
          totalCentavos,
          voucherId: voucher?.id ?? null,
          voucherCodigo: voucher?.codigo ?? null,
          nomeCliente: v.nomeCliente,
          telefone: v.telefone,
          cep: v.cep || null,
          endereco: v.endereco || null,
          observacao: v.observacao || null,
          itens: {
            create: linhas.map((i) => ({
              produtoId: i.produtoId, sku: i.sku, nome: i.nome, slug: i.slug,
              imagem: i.imagem, precoCentavos: i.precoCentavos, qtd: i.qtd,
            })),
          },
        },
        select: { id: true, numero: true },
      })

      // Marca o voucher como usado (condicionado a ainda estar livre).
      if (voucher) {
        const upd = await tx.voucher.updateMany({
          where: { id: voucher.id, usado: false },
          data: { usado: true, usadoEm: new Date(), pedidoId: criado.id },
        })
        if (upd.count === 0) throw new Error("VOUCHER_USADO")
      }

      return criado
    })

    return { ok: true, id: pedido.id, numero: pedido.numero }
  } catch (e) {
    const msg = (e as Error).message
    if (msg === "VOUCHER_USADO") {
      return { ok: false, error: "O voucher acabou de ser usado em outro pedido." }
    }
    if (msg.startsWith("ESTOQUE:")) {
      return { ok: false, error: `Estoque insuficiente para "${msg.slice(8)}". Alguém comprou antes — ajuste a quantidade.` }
    }
    console.error("Erro ao criar pedido:", e)
    return { ok: false, error: "Não foi possível registrar o pedido. Tente novamente." }
  }
}
