# Spec 008 — Fase de Vendas: Site, Loja, Admin e Código da Sorte

> **Status:** Em andamento · Aprovado pelo Álvaro (jul/2026). Consolida a fase de
> vendas e referencia [001-site](../001-site-divulgacao/spec.md),
> [002-ecommerce](../002-ecommerce/spec.md), [003-admin](../003-area-administrativa/spec.md),
> [004-quebra-cabeças](../004-produto-quebra-cabecas/spec.md).

## Contexto
Nova fase da Arte & Tradição: sair do estúdio de cards e montar a operação de
vendas dos **quebra-cabeças dos Santos** (produto reformulado, embalagem A3 com
corte e vinco, ~40 peças, artesanal). Ferramenta interna + loja pública.

## Decisões aprovadas
1. **1 Santo = 1 produto** (sem variações por ora). Produto com **SKU**.
2. **QR da embalagem = por modelo** → aponta para a página do Santo (`/santos/[slug]`).
   O QR é o mesmo para todas as caixas do Santo.
3. **Login obrigatório** para comprar (histórico e rastreio por usuário).
4. **PIX manual**: carrinho com total variável; a chave é do Álvaro; ele confirma o
   recebimento na plataforma. Gateway fica para depois.
5. **Santo é entidade própria** relacionada ao Produto (e reaproveita o catálogo).

## Código da Sorte (herda do Courtesyfy)
- Código único por unidade, impresso na embalagem, formato **XXXX-XXXX-XXXX-XXXX**
  (alfanumérico, sem caracteres ambíguos), associado ao **Santo** da caixa.
- Fluxo: **gerado → impresso/liberado → resgatado**. Só funciona depois de liberado.
- **Prêmio pré-atribuído no lote**, por uma **tabela que o Álvaro define** (controle de
  custo). O prêmio "grátis" **não existe** — apenas **vouchers de desconto (até 50%)**.
- **Voucher tem validade** (ex.: 60 dias) e vale para **um Santo diferente do da caixa**.
- Cliente resgata no **perfil logado**: input central "Tente a sorte"; comprou 10 caixas
  = 10 tentativas. Anti-fraude: rate-limit por usuário/IP.

## Modelo de dados
`Santo` (nome, slug, história, data, imagem, bordaCor) ✅ · `Categoria` · `Produto`
(SKU → Santo, → Categoria, preço, estoque, fotos) · `Pedido` + `ItemPedido` (→ User,
status, PIX) · `CodigoSorte` (código, → Santo, lote, estado, prêmio) · `Voucher`
(→ User, percentual, santoExcluidoId, validade, usado).

## Progresso
- [x] **Passo 1 — Santo (entidade) + migração dos 67 + páginas com QR** (`/santos`, `/santos/[slug]`).
      Reaproveita nome/data/história/imagem/cor do CardSanto. QR gerado por Santo, com download
      para a embalagem. SEO (metadados + Open Graph por Santo). Imagens da vitrine da home movidas
      para `/catalogo` (evita conflito com a rota `/santos`).
- [ ] Passo 2 — Admin: CRUD de Categorias + Produtos (SKU), Produto ligado ao Santo.
- [ ] Passo 3 — Loja: vitrine + página de produto + carrinho.
- [ ] Passo 4 — Checkout + Pedido + PIX manual + painel de pedidos.
- [ ] Passo 5 — Código da Sorte (gerar/liberar/exportar + tentar a sorte + voucher).
- [ ] Depois — gateway de pagamento, frete, colecionismo avançado.

## Notas técnicas / dívidas
- Páginas de Santo usam ISR (`revalidate 3600`); imagem ainda em dataURL no banco —
  mover para Cloudinary (backlog) para aliviar peso e dependência do banco.
- `Santo` hoje é uma cópia migrada do `CardSanto`. Enquanto os cards estão pausados,
  vivem separados; no futuro, unificar (CardSanto referencia Santo).
