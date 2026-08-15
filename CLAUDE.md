# Arte & Tradição — Guia para Claude Code

> Carregado automaticamente em toda sessão. Leia antes de qualquer alteração.

## O que é este projeto

**Arte & Tradição** é a plataforma que centraliza o negócio da empresa Arte & Tradição — produtos devocionais lúdicos inspirados nos **Santos da Igreja Católica**. O foco atual é o **Quebra-cabeças dos Santos** (produto histórico). Jogo da Memória e Álbum de Figurinhas estão **pausados** (rotas de "cards" ocultadas do site e do painel).

A plataforma tem **três áreas amarradas**: site de divulgação, e-commerce (loja) e painel administrativo.

**Status:** ✅ **Sistema de vendas no ar** (spec 008) — loja + carrinho + checkout + PIX + pedidos + **Código da Sorte** + admin de usuários. **Idioma:** pt-BR. **Banco:** MySQL Hostinger, **em uso** (não é mais "a vir"). Deploy: push na `main` → Vercel. Guia operacional: [`docs/GUIA-OPERACAO.md`](docs/GUIA-OPERACAO.md).

## Origem do código: base Courtesyfy (já removida)

O projeto **nasceu** de um clone do Courtesyfy, mas o domínio Courtesyfy (campanhas, chaves, lojas, resgates, Stripe, modelos Prisma correspondentes) **já foi removido**. Ficou o núcleo reaproveitado: **auth** (NextAuth v5, credenciais + Google), infra (Prisma/MySQL, Resend, Upstash, Cloudinary) e o tema do painel. Sobre isso construímos o sistema de vendas (spec 008). Restos herdados a observar: o `role` default no schema é `LOJISTA` (por isso o cadastro público força `CLIENTE`).

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
7. **Cards pausados** — não reexibir "Cards dos Santos"/"Jogo da Memória" no site ou menu sem o Álvaro pedir. O QR das embalagens é **interno** (`/dashboard/santos`), nunca no site público.
8. **Preço em centavos** (`precoCentavos: Int`). **Estoque é rigoroso**: baixa na criação do pedido, devolve no cancelamento — não furar isso.
9. **Windows:** matar o `node` antes de `prisma db push`/`npm run build` (a dll do query engine trava → EPERM).

## Design — site público (cores pastéis)

O site (`src/app/(site)/`) usa o tema pastel **Arte & Tradição** (`(site)/theme-arte.css`, escopo `.arte-site`): creme, dourado suave, sálvia, azul mariano, rosa. Isolado do tema **escuro** do painel (Courtesyfy) em `src/app/globals.css`. Serifa `Cormorant Garamond` nos títulos.

## Rotas principais

| Rota | Área |
|---|---|
| `/` | Site — landing (quebra-cabeças + premiação) |
| `/como-funciona` | Explica a premiação (Código da Sorte) — público |
| `/santos`, `/santos/[slug]` | Páginas públicas dos Santos (história, data) |
| `/loja`, `/loja/[slug]` | Loja + página de produto |
| `/loja/carrinho`, `/loja/checkout`, `/loja/pedido/[id]` | Carrinho, checkout (login), confirmação + PIX |
| `/minha-conta`, `/minha-conta/pedidos`, `/minha-conta/sorte` | Área do comprador (pedidos, "Tente a sorte") |
| `/dashboard` | Painel (equipe: SUPER_ADMIN/LOJISTA; CLIENTE é barrado) |
| `/dashboard/pedidos` | Confirmar pagamento/envio, cancelar/reabrir |
| `/dashboard/produtos`, `/dashboard/categorias` | CRUD do catálogo |
| `/dashboard/santos` | **QR das embalagens** (produção) — baixar PNG |
| `/dashboard/sorte` | Gerar lotes de códigos, liberar, exportar CSV |
| `/dashboard/usuarios` | Gestão de usuários (só SUPER_ADMIN) |
| `/dashboard/cards`, `/dashboard/memoria` | **Pausados** — fora do menu (rotas mantidas) |

Proteção (middleware): tudo é público, **exceto** `/dashboard`, `/minha-conta` e
`/loja/{checkout,pedido}` (exigem login, com `callbackUrl`).

## Como rodar

```bash
npm install        # node_modules não versionado
npm run dev        # http://localhost:3000
npm run build      # update-version + prisma generate + next build
npm run db:push    # sincroniza o schema com o banco (sem --accept-data-loss)
```

**Variáveis de ambiente (Vercel):** `DATABASE_URL`; `PIX_CHAVE`/`PIX_NOME`/`PIX_CIDADE` (PIX do checkout); `NEXT_PUBLIC_SITE_URL` (domínio próprio, usado no QR das embalagens — o `baseUrl()` ignora `localhost`). Sem as de PIX, o pedido só avisa que o PIX não está configurado.

---
*Guia do projeto Arte & Tradição. Base técnica: Courtesyfy. Criado: 2026-07-21.*
