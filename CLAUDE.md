# Arte & Tradição — Guia para Claude Code

> Carregado automaticamente em toda sessão. Leia antes de qualquer alteração.

## O que é este projeto

**Arte & Tradição** é a plataforma que centraliza o negócio da empresa Arte & Tradição — produtos devocionais lúdicos inspirados nos **Santos da Igreja Católica**:
1. **Quebra-cabeças dos Santos** (produto histórico)
2. **Jogo da Memória dos Santos** (novo)
3. **Álbum de Figurinhas dos Santos** (novo — reaproveita o motor de "chaves/cortesias" do base)

A plataforma tem **três áreas**: site de divulgação, e-commerce (loja) e área administrativa.

**Status:** Release 0 — casca inicial. **Idioma:** pt-BR. **Banco:** MySQL (a ser fornecido pelo Álvaro).

## ⚠️ Origem do código: base Courtesyfy

Este projeto é um **clone do Courtesyfy** (SaaS de cortesias) em adaptação. Muita coisa ainda tem nomes/lógica do Courtesyfy (`Loja`, `Campanha`, `Chave`, Stripe, dashboard). **Isso é intencional** — reaproveitamos a infra. A adaptação é incremental, spec por spec. A landing antiga do Courtesyfy está preservada em `src/app/_legacy/`.

## Método: Spec-Driven Development

**A spec é o source of truth; o código é regenerável.** Fluxo por feature (comandos em `.claude/commands/`):

```
/constituicao  → princípios invioláveis (.specify/memory/constitution.md)
/especificar   → specs/NNN-feature/spec.md   (o "o quê")
/planejar      → specs/NNN-feature/plan.md   (o "como")
/tarefas       → specs/NNN-feature/tasks.md  (tarefas atômicas)
/implementar   → executa em código
```

Documentos-chave a ler:
| Arquivo | Conteúdo |
|---|---|
| `spec.md` | **Spec mestra** — visão, produtos, personas, JTBD, arquitetura das 3 áreas |
| `.specify/memory/constitution.md` | Princípios invioláveis |
| `specs/NNN-*/spec.md` | Specs por feature/produto (006 = álbum de figurinhas, o reuso das chaves) |
| `docs/adr/*` | Decisões arquiteturais (0003 = auth Google+JWT **a confirmar**) |
| `docs/referencia/` | Exemplo do método (projeto "Achei no Jardim Botânico") |

## Stack (herdada do base)

Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Prisma/MySQL · NextAuth v5 (Google + credenciais) · Stripe · Cloudinary · Resend · Upstash (rate-limit) · Vitest · Vercel.

## Regras críticas — NUNCA ignore

1. **Não rodar migração destrutiva** (`prisma db push --accept-data-loss`) sem confirmação explícita do Álvaro.
2. **Não mudar auth** sem ver `docs/adr/0003` (a troca database→JWT está proposta, não confirmada).
3. **Sempre** `import { db } from "@/lib/prisma"` e `import { auth } from "@/lib/auth"`.
4. **Sempre validar** inputs com Zod em Server Actions e API Routes.
5. **Fidelidade iconográfica dos Santos** é requisito (Constituição §1).
6. **Spec antes do código** — se a spec não está clara, não codifica.
7. **Preservar o painel Courtesyfy** existente até que a spec correspondente o adapte.

## Design — site público (cores pastéis)

O site (`src/app/(site)/`) usa o tema pastel **Arte & Tradição** (`(site)/theme-arte.css`, escopo `.arte-site`): creme, dourado suave, sálvia, azul mariano, rosa. Isolado do tema **escuro** do painel (Courtesyfy) em `src/app/globals.css`. Serifa `Cormorant Garamond` nos títulos.

## Rotas principais (novas)

| Rota | Área |
|---|---|
| `/` | Site — landing de divulgação (3 produtos) |
| `/loja` | E-commerce — catálogo (esqueleto) |
| `/login` | Entrada (base) → `/dashboard` |
| `/dashboard/*` | Painel administrativo (base Courtesyfy, a adaptar) |

## Como rodar

```bash
npm install        # node_modules não versionado
npm run dev        # http://localhost:3000
npm run build      # gera + prisma generate + db push (cuidado!)
```

---
*Guia do projeto Arte & Tradição. Base técnica: Courtesyfy. Criado: 2026-07-21.*
