# ADR-0004: Provedor de pagamento — Stripe (atual) vs Asaas/PIX

## Status
Proposto

## Contexto
O base já integra **Stripe** (planos + produtos físicos com checkout público e webhook). O e-commerce da Arte & Tradição vende produtos físicos para público brasileiro, onde **PIX** e boleto têm forte adesão e taxas menores.

## Decisão (proposta)
Manter Stripe para a casca inicial (já funciona) e **reavaliar Asaas/Mercado Pago** quando o e-commerce (spec 002) entrar em foco, priorizando PIX nativo e emissão de NF-e para compras em volume (Padre Marcos).

## Consequências
Curto prazo: zero retrabalho. Médio prazo: possível troca/adição de gateway com abstração da camada de pagamento.

## Alternativas consideradas
- **Só Stripe:** simples, mas PIX no Stripe Brasil é limitado.
- **Trocar já para Asaas:** retrabalho antes da hora; o e-commerce ainda não é o foco de R0.
