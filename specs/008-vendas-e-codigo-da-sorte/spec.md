# Spec 008 — Fase de Vendas: Site, Loja, Admin e Código da Sorte

> **Status:** ✅ Implementado (site + loja + admin + Código da Sorte, ago/2026) ·
> Aprovado pelo Álvaro (jul/2026). Consolida a fase de
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

## Refinamentos (ago/2026)
- **Prêmios em 3 níveis** (definidos na tabela do lote): **Desconto 1–50%**, **Grátis
  (100%)** = um quebra-cabeça grátis de outro Santo, e **Sem prêmio (0%)** = código válido
  mas não contemplado. Estratégia do Álvaro: numa rodada de 100, ~**10 grátis** na 1ª rodada
  para difundir o programa, diminuindo nas seguintes ("muitos contemplados geram mais vendas").
  Pedido com total zero (prêmio grátis) já entra como **PAGO** (nada a pagar).
- **QR da embalagem é interno (produção)**: saiu da página pública do Santo. Agora fica em
  `/dashboard/santos` ("Santos & QR"), de onde o Álvaro baixa o PNG para a arte da caixa.
- **Estoque rigoroso**: baixa **atômica** na criação do pedido (impede vender além do
  disponível, mesmo em cliques simultâneos); **devolve** ao cancelar e **rebaixa** ao reabrir
  um cancelado. Carrinho e checkout respeitam o limite; produto sem estoque não é vendável.
- **Cards pausados**: "Cards dos Santos", "Jogo da Memória" e a vitrine de álbum na home foram
  ocultados do site e do painel (rotas mantidas). Foco 100% nos quebra-cabeças.
- **Site**: nova página pública **`/como-funciona`** explicando a premiação + seção na home.

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
- [x] **Passo 2 — Admin: CRUD de Categorias + Produtos (SKU)**, Produto ligado ao Santo e à
      Categoria (preço em centavos, estoque, foto, ativo). Itens no menu do painel.
- [x] **Passo 3 — Loja:** vitrine ligada ao banco com **menu lateral de categorias**,
      página de produto (adicionar/comprar), **carrinho** (Context + localStorage) e seção
      "quebra-cabeças deste Santo" na página do Santo.
- [x] **Passo 4 — Checkout + Pedido + PIX:** checkout com login obrigatório (retorno via
      `callbackUrl`), modelos `Pedido`/`ItemPedido`/`PedidoStatus`, **PIX Copia-e-Cola**
      (BR Code EMV + CRC16, `src/lib/pix.ts`) com QR e valor exato, página de confirmação,
      "Meus pedidos" na conta e **painel de pedidos** (filtro por status, confirmar
      pagamento/envio, cancelar/reabrir).
- [x] **Passo 5 — Código da Sorte:** `CodigoSorte` + `Voucher`; admin gera **lote por Santo
      com tabela de prêmios**, libera/bloqueia e exporta **CSV**; cliente resgata em
      "Tente a sorte" → voucher (desconto até 50%, 90 dias) que **não vale para o Santo da
      caixa**; aplicação no checkout (recálculo server-authoritative).
- [x] **Extra — Admin de usuários/compradores** (`/dashboard/usuarios`, só SUPER_ADMIN):
      nível (Cliente/Lojista/Admin), ativar/desativar, verificar e-mail manualmente.
      Cadastro público agora cria **CLIENTE**; painel bloqueia CLIENTE.
- [ ] Depois — gateway de pagamento, frete, colecionismo avançado, baixa de estoque
      automática na confirmação do pagamento, unificação Santo/CardSanto.

## Variáveis de ambiente (Vercel)
- `PIX_CHAVE`, `PIX_NOME`, `PIX_CIDADE` — habilitam o PIX Copia-e-Cola no checkout.
  Sem elas, a página do pedido mostra um aviso amigável (não quebra).
- `NEXT_PUBLIC_SITE_URL` — domínio próprio quando houver (o QR das embalagens usa isso).
  ⚠️ Havia `NEXT_PUBLIC_URL=http://localhost:3000` no ambiente; o `baseUrl()` agora
  ignora localhost, mas convém corrigir/remover essa variável na Vercel.

## Notas técnicas / dívidas
- Páginas de Santo usam ISR (`revalidate 3600`); imagem ainda em dataURL no banco —
  mover para Cloudinary (backlog) para aliviar peso e dependência do banco.
- `Santo` hoje é uma cópia migrada do `CardSanto`. Enquanto os cards estão pausados,
  vivem separados; no futuro, unificar (CardSanto referencia Santo).
