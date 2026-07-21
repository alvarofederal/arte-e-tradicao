# ADR-0001: Stack e projeto base (clonar Courtesyfy)

## Status
Aceito

## Contexto
A Arte & Tradição precisa de uma plataforma que centralize site de divulgação, e-commerce e área administrativa, com login Google e um mecanismo de "código único → coleção" para o álbum de figurinhas. Já existe o **Courtesyfy** — SaaS maduro em produção com exatamente essa infra (Next.js 16, TS, Tailwind v4, shadcn, Prisma/MySQL, NextAuth v5 com Google, Stripe, Cloudinary, Resend, upstash rate-limit) e o motor de **Chaves** (cortesias), que é a mecânica do álbum.

## Decisão
Usar o Courtesyfy clonado como **projeto base** e adaptá-lo incrementalmente (spec por spec) para a Arte & Tradição, em vez de começar do zero.

## Consequências
**Ganhamos:** auth, pagamento, upload, rate-limit, testes e o motor de chaves prontos; velocidade de R0→R4.
**Perdemos/custo:** dívida de domínio (nomes "loja/campanha/chave/cortesia") a limpar com intenção; risco de confundir domínios se o reuso não for consciente (ver Constituição §8).

## Alternativas consideradas
- **Começar do zero:** mais limpo, muito mais lento; descartado.
- **Manter dois projetos separados:** contraria o pedido de "centralizar tudo aqui".
