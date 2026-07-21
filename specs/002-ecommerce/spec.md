# Spec 002 — E-commerce (Loja)

> **Status:** Rascunho · **Release alvo:** R2 · **Depende de:** auth (Google+JWT), pagamento

## Contexto
Venda dos produtos físicos (quebra-cabeças, jogos da memória, kits de figurinhas). O base já tem Stripe integrado e checkout de produtos — reaproveitar e adaptar ao catálogo da Arte & Tradição.

## Critérios de aceite
- [ ] Catálogo `/loja` com filtro por linha de produto e por Santo/coleção.
- [ ] Página de produto com galeria, descrição, ficha do Santo, preço, variações.
- [ ] Carrinho persistente.
- [ ] Checkout com pagamento (Stripe hoje; avaliar Asaas/PIX — ADR-0004).
- [ ] Cálculo de frete e endereço de entrega.
- [ ] Conta do cliente: `/minha-conta` com dados, pedidos e álbum.
- [ ] Emissão de comprovante; nota fiscal para compra em volume (Padre Marcos) — a detalhar.
- [ ] Emails transacionais (Resend): confirmação, pagamento, envio.

## Não-objetivos
- Marketplace / vendedores terceiros.
- Assinatura recorrente (v1).

## Riscos
Frete e logística; conciliação de pagamento via webhook (padrão já existe no base).

## Métricas de sucesso
Conversão do catálogo, ticket médio, pedidos concluídos, taxa de recompra.
