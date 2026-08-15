# Guia de Operação — Arte & Tradição

> Como operar a plataforma no dia a dia: cadastrar produtos, gerar os códigos da
> sorte, tirar o QR para a embalagem, confirmar pagamentos e cuidar do estoque.
> Atualizado em ago/2026 (spec 008).

## Visão geral do fluxo

```
Você (produção)                        Cliente
────────────────                       ───────
1. Cadastra Categoria + Produto        1. Navega na loja pública
   (SKU, preço, estoque, foto,         2. Adiciona ao carrinho
    ligado a um Santo)                 3. Cria conta e faz login
2. Baixa o QR do Santo e coloca        4. Finaliza → PIX Copia-e-Cola
   na arte da embalagem                5. Você confirma o pagamento
3. Gera um lote de Códigos da Sorte    6. Digita o código da caixa em
   e imprime nas caixas                   "Tente a sorte" → ganha voucher
4. Confirma pagamento e envio          7. Usa o voucher na próxima compra
```

Três áreas, tudo amarrado: **site** (divulgação), **loja** (venda) e **painel**
(`/dashboard`, para a equipe).

---

## 1. Catálogo: categorias e produtos

- **Categorias** — `/dashboard/categorias`. Servem de menu lateral na loja. Uma
  categoria só pode ser excluída se não tiver produtos.
- **Produtos** — `/dashboard/produtos`. Cada produto tem:
  - **SKU** (código interno, único), **nome**, **descrição**;
  - **preço** (digite em reais; guardamos em centavos);
  - **estoque** (ver seção 6 — é levado a sério);
  - **foto** (se vazia, usa a imagem do Santo);
  - **Santo** vinculado (1 Santo = 1 produto) e **Categoria**;
  - **ativo** (produto inativo some da loja).

> Regra do negócio: **1 Santo = 1 produto**. O vínculo com o Santo alimenta a
> página pública do Santo, o QR e a regra do voucher (ver seção 3 e 5).

---

## 2. QR das embalagens (produção)

Em **`/dashboard/santos` ("Santos & QR")** você vê todos os Santos com o QR pronto
para baixar (PNG). Esse QR:

- é **o mesmo para todas as caixas do mesmo Santo**;
- aponta para a **página pública do Santo** (história + data litúrgica);
- é **coisa interna** — não aparece mais no site para o cliente.

Baixe o PNG e coloque na arte da embalagem. Quem escanear cai na página do Santo.

> Não confundir com o **Código da Sorte** (seção 3): o QR é do modelo; o Código da
> Sorte é **único por caixa** e impresso à parte.

---

## 3. Código da Sorte (premiação)

Em **`/dashboard/sorte`**. Cada caixa leva um código único
`XXXX-XXXX-XXXX-XXXX` (sem letras/números ambíguos como O/0, I/1/L).

### Gerar um lote
1. Escolha o **Santo da caixa** (esse Santo fica **excluído** do prêmio — o desconto
   vale para *outro* Santo, incentivando a coleção).
2. (Opcional) dê um **rótulo** ao lote — se deixar vazio, geramos um automático.
3. Monte a **tabela de prêmios**, uma faixa por linha. Cada faixa tem um **tipo** e
   uma **quantidade**:
   - **Desconto** (1–50%);
   - **Grátis** (100%) — um quebra-cabeça grátis de outro Santo;
   - **Sem prêmio** — o código é válido, mas "não foi dessa vez".
4. Marque **"Já liberar"** se quiser ativar na hora (senão, libere depois).
5. Gerar → os prêmios são **embaralhados** entre os códigos.

**Estratégia sugerida (Álvaro):** numa rodada de 100, comece com **~10 grátis** para
difundir o programa e vá **diminuindo** nas próximas rodadas. Muitos contemplados
geram mais vendas e vontade de participar. Exemplo de tabela para 100 códigos:

| Tipo | % | Quantidade |
|---|---|---|
| Grátis | 100 | 10 |
| Desconto | 30 | 20 |
| Desconto | 20 | 30 |
| Desconto | 10 | 40 |

### Liberar / bloquear
Um lote só vale depois de **liberado**. Use o cadeado na lista para liberar (ativar)
ou bloquear. Bloquear **não** afeta códigos já resgatados.

### Exportar CSV
Botão de download em cada lote: gera um CSV (`codigo;desconto;santo;liberado;
resgatado`) para conferência e para a impressão nas caixas.

---

## 4. Fluxo do cliente

1. Compra na loja (login obrigatório no checkout).
2. Recebe o **PIX Copia-e-Cola** com o valor exato + QR (ver seção 7 para ativar).
3. Você confirma o pagamento no painel (seção 5).
4. Com a caixa em mãos, o cliente entra em **"Tente a sorte"** (`/minha-conta/sorte`),
   digita o código e descobe o prêmio na hora.
5. O prêmio vira um **voucher** na conta (validade **90 dias**), que ele aplica no
   checkout da próxima compra. O voucher **não vale para o Santo da caixa**.

---

## 5. Pedidos (painel)

Em **`/dashboard/pedidos`** — filtre por status e abra um pedido para:

- **Confirmar pagamento** (após ver o PIX cair na sua conta) → status **Pago**;
- **Marcar como enviado** → status **Enviado**;
- **Cancelar** → devolve o estoque dos itens;
- **Reabrir** → volta para "aguardando" (se veio de cancelado, rebaixa o estoque de
  novo, checando disponibilidade).

Pedidos com **total zero** (prêmio grátis) já entram como **Pago** — nada a receber,
é só preparar e enviar.

---

## 6. Estoque rigoroso

- A quantidade no carrinho **respeita o estoque** do produto.
- Ao **finalizar o pedido**, o estoque é **baixado de forma atômica** — dois clientes
  não conseguem comprar a última unidade ao mesmo tempo.
- Produto com estoque **0** aparece como **Esgotado** e não pode ser comprado.
- **Cancelar** um pedido **devolve** o estoque; **reabrir** um cancelado **rebaixa**.
- Ajuste manual de estoque: edite o produto em `/dashboard/produtos`.

---

## 7. Configuração (variáveis de ambiente na Vercel)

| Variável | Para quê |
|---|---|
| `DATABASE_URL` | Banco MySQL (já configurada) |
| `PIX_CHAVE` | Sua chave PIX (e-mail, CPF/CNPJ, telefone ou aleatória) |
| `PIX_NOME` | Nome do recebedor (aparece no PIX) |
| `PIX_CIDADE` | Cidade do recebedor |
| `NEXT_PUBLIC_SITE_URL` | Domínio próprio (quando houver) — usado no QR |

Sem `PIX_*`, a página do pedido mostra um aviso amigável em vez do código PIX (não
quebra). ⚠️ Existe uma `NEXT_PUBLIC_URL=http://localhost:3000` no ambiente; o
`baseUrl()` ignora localhost, mas vale corrigir/remover essa variável.

---

## 8. Usuários (só administrador)

Em **`/dashboard/usuarios`** (visível apenas para SUPER_ADMIN):

- ver compradores e equipe (e-mail, nível, verificação, login por senha/Google, nº de
  pedidos, acessos);
- mudar o **nível**: Cliente, Equipe (Lojista) ou Administrador;
- **ativar/desativar** uma conta;
- **verificar e-mail manualmente** — útil para onboarding e para testar o fluxo de
  compra sem depender do envio de e-mail.

> Cadastro público cria sempre **Cliente**. O painel bloqueia Cliente (redireciona
> para "Minha conta").

---

## 9. Deploy

`git push` na branch **`main`** → a Vercel faz o build e publica automaticamente.
No Windows, **feche o servidor de dev** antes de `prisma db push`/`npm run build`
(a dll do Prisma trava → erro EPERM).
