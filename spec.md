# Arte & Tradição — Especificação Mestra da Plataforma

> Documento mestre de especificação da plataforma **Arte & Tradição**, combinando **Lean Inception** (descoberta), **Jobs to Be Done** (demanda), **Spec-Driven Development** (execução com Claude Code) e **arquitetura técnica**.
>
> Este é o contrato que guia o desenvolvimento do início ao fim. Os artefatos aqui são **vivos** — evoluem com o projeto. A spec é o *source of truth*; código é output regenerável.
>
> **Status:** Release 0 — Casca inicial da plataforma
> **Base técnica:** projeto Courtesyfy (clonado e em adaptação)
> **Idioma:** Português Brasileiro (pt-BR) · **Moeda:** Real (BRL)

---

## Parte 0 — Como vamos trabalhar (o método)

Este projeto combina três práticas complementares. O método detalhado (Lean Inception do Caroli, JTBD do Christensen/Ulwick e o Spec-Kit do GitHub) está documentado com profundidade em [`docs/referencia/lean-inception-achei-jardim-botanico.md`](docs/referencia/lean-inception-achei-jardim-botanico.md) — usamos aquele projeto como **referência de método**, não de produto.

```
LEAN INCEPTION (descoberta)   →  Personas + Jornadas + Features
        ↓
JTBD (validação de demanda)   →  Job Statements + Forces of Progress
        ↓
MVP Canvas + Sequencer        →  Priorização em releases
        ↓
SPEC-DRIVEN DEV (execução)    →  /constituicao → /especificar → /planejar → /tarefas → /implementar
        ↓
       Código
```

### Fluxo Spec-Driven no Claude Code

Comandos disponíveis (em `.claude/commands/`) — cada feature nova passa por este fluxo antes de virar código:

```
/constituicao    → princípios invioláveis do projeto (1x no início)
/especificar     → cria a spec da feature (o "o quê")   → specs/NNN-feature/spec.md
/planejar        → plano técnico de implementação (o "como") → specs/NNN-feature/plan.md
/tarefas         → quebra o plano em tarefas executáveis → specs/NNN-feature/tasks.md
/implementar     → executa as tarefas em código
```

A spec é escrita e revisada **antes** do código. Se a implementação divergir, atualiza-se a spec.

---

## Parte 1 — Quem é a Arte & Tradição

A **Arte & Tradição** é uma empresa que desenvolve produtos artesanais e lúdicos inspirados nos **Santos da Igreja Católica Apostólica Romana**. O produto histórico são os **quebra-cabeças dos Santos**. A empresa agora expande para uma **plataforma digital** que centraliza três frentes de negócio e três linhas de produto.

### 1.1 Visão do Produto (Geoffrey Moore Template)

> **PARA** famílias católicas, catequistas, paróquias e devotos que valorizam a fé e a tradição
> **QUE** buscam produtos que unam devoção, arte e brincadeira educativa para todas as idades,
> **A Arte & Tradição** é uma **plataforma de produtos devocionais lúdicos**
> **QUE** cria, vende e gerencia quebra-cabeças, jogos da memória e álbuns de figurinhas dos Santos,
> **DIFERENTE DE** brinquedos genéricos e artigos religiosos comuns (imagens, terços, livros),
> **NOSSO PRODUTO** entrega catequese através do brincar, com curadoria iconográfica fiel, arte própria e uma experiência digital que conecta o físico (o produto na mão) ao digital (o álbum, o jogo, a coleção).

### 1.2 Produto É / Não É / Faz / Não Faz

| **É** | **NÃO É** |
|---|---|
| Uma plataforma de produtos devocionais lúdicos | Uma loja de artigos religiosos genéricos |
| Catequese pelo brincar (fé + educação) | Um brinquedo secular sem propósito |
| Curadoria iconográfica fiel dos Santos | Conteúdo doutrinário ou catequético formal |
| Ponte entre o produto físico e a coleção digital | Um jogo puramente digital sem produto físico |

| **FAZ** | **NÃO FAZ** |
|---|---|
| Vende produtos físicos (quebra-cabeças, jogos, álbuns) | Vende assinatura de conteúdo (v1) |
| Gera figurinhas colecionáveis via código único (QR) | Aposta / jogo de azar |
| Divulga a marca e os Santos com conteúdo | Substitui a catequese da paróquia |
| Centraliza venda, divulgação e administração | Fabrica sob demanda de terceiros (marketplace) |

### 1.3 Personas

**Persona 1 — Sônia, 52, catequista e avó.** Compra para presentear netos e usar na catequese. Valoriza fidelidade à iconografia e material de qualidade. Chega por indicação da paróquia e redes sociais.

**Persona 2 — Padre Marcos, 41, pároco.** Compra em volume para bazares, festas do padroeiro e catequese. Precisa de nota fiscal, compra por lote e material que "conte a história do Santo".

**Persona 3 — Juliana, 34, mãe católica.** Quer brincadeiras que transmitam a fé aos filhos longe das telas. Descobre pelo Instagram, compra pelo celular, valoriza o álbum de figurinhas como atividade em família.

**Persona 4 — Álvaro (você), operador/admin.** Precisa de painel para gerenciar catálogo, produtos, estoque, pedidos, campanhas de figurinhas e métricas — tudo centralizado.

### 1.4 Jobs to Be Done

> **Sônia:** *Quando* preparo a catequese ou quero presentear meus netos, *eu quero* um produto que ensine a vida dos Santos brincando, *para que* a fé seja transmitida de forma alegre e memorável.

> **Juliana:** *Quando* busco atividades que afastem meus filhos das telas e aproximem da fé, *eu quero* jogos e coleções bonitos e católicos, *para que* a família se reúna em torno da tradição.

> **Padre Marcos:** *Quando* organizo a vida pastoral e as festas da paróquia, *eu quero* comprar em volume material devocional de qualidade com nota fiscal, *para que* eu evangelize e ainda gere renda para a comunidade.

**Dimensões (Sônia):** funcional (ensinar os Santos), emocional (transmitir a fé, nostalgia), social (ser vista como quem cuida da formação religiosa da família).

---

## Parte 2 — As três linhas de produto

### 2.1 Quebra-cabeças dos Santos *(produto histórico)*
Quebra-cabeças físicos com a imagem de um Santo. Cada produto tem uma ficha do Santo (biografia curta, data litúrgica, oração). Detalhes em [`specs/004-produto-quebra-cabecas/spec.md`](specs/004-produto-quebra-cabecas/spec.md).

### 2.2 Jogo da Memória dos Santos *(novo)*
Jogo de pares (memória) físico e/ou digital. Pares = imagem do Santo + símbolo/atributo (ex.: São Jorge ↔ dragão; Santa Luzia ↔ olhos). Cada acerto pode revelar uma micro-ficha do Santo. Detalhes em [`specs/005-produto-jogo-memoria/spec.md`](specs/005-produto-jogo-memoria/spec.md).

### 2.3 Álbum de Figurinhas dos Santos *(novo — reaproveita o motor de Chaves do Courtesyfy)*

> **Insight central (pedido do Álvaro):** a criação e distribuição das figurinhas usa **a mesma mecânica das cortesias do Courtesyfy** — código único → QR → escanear → "abrir" a figurinha → colar no álbum digital.

Detalhes e o mapeamento completo em [`specs/006-produto-album-figurinhas/spec.md`](specs/006-produto-album-figurinhas/spec.md). Resumo do reaproveitamento:

| Courtesyfy (cortesias) | Arte & Tradição (figurinhas) |
|---|---|
| `Campanha` | **Coleção / Álbum** (ex.: "Santos do Brasil", "Apóstolos") |
| `LoteChave` | **Lote de figurinhas impressas** de uma coleção |
| `Chave` (código único `XXXX-XXXX-...`) | **Código da figurinha** (impresso no pacotinho/produto) |
| QR aponta para `/c/[codigo]` | QR aponta para a página que **revela a figurinha** |
| `Ativação` (cliente vincula tel/email) | **Colecionador** vincula a figurinha à sua conta/álbum |
| `Resgate` (operador valida) | **Colar no álbum** (a figurinha entra na coleção do usuário) |
| Chave RESGATADA é imutável | Figurinha, uma vez colada, pertence àquele colecionador |
| `LogEvento` | Histórico de aberturas/trocas |

O que **muda** em relação às cortesias: uma figurinha pode ser **repetida** (mecânica de troca), o álbum tem **progresso/completude** (ex.: 42/60 coladas), e há a camada lúdica de **coleção** (raridade, brilhantes, troca entre colecionadores — fases futuras).

---

## Parte 3 — Arquitetura da plataforma (as três áreas)

A plataforma **centraliza tudo** em um único projeto Next.js, organizado em três áreas:

```
┌─────────────────────────────────────────────────────────────┐
│                    ARTE & TRADIÇÃO                           │
├──────────────────┬──────────────────┬───────────────────────┤
│  SITE DE          │   E-COMMERCE      │   ÁREA ADMINISTRATIVA │
│  DIVULGAÇÃO       │   (loja)          │   (painel)            │
│  público          │   público + conta │   restrito (admin)    │
├──────────────────┼──────────────────┼───────────────────────┤
│ /(site)          │ /(loja)           │ /(painel)/dashboard   │
│ • Home           │ • Catálogo        │ • Catálogo/produtos   │
│ • Os 3 produtos  │ • Produto         │ • Estoque             │
│ • Sobre / história│ • Carrinho        │ • Pedidos             │
│ • Santos (blog)  │ • Checkout        │ • Coleções/figurinhas │
│ • Contato        │ • Minha conta     │ • Álbuns dos usuários │
│                  │ • Meus pedidos    │ • Campanhas / lotes   │
│                  │ • Meu álbum       │ • Métricas (KPIs)     │
└──────────────────┴──────────────────┴───────────────────────┘
                    Autenticação: Google OAuth + JWT
                    Banco: MySQL (Prisma) — a definir/importar
```

Specs por área: [`001-site-divulgacao`](specs/001-site-divulgacao/spec.md) · [`002-ecommerce`](specs/002-ecommerce/spec.md) · [`003-area-administrativa`](specs/003-area-administrativa/spec.md).

---

## Parte 4 — Stack técnica

Herdada e adaptada do projeto base (Courtesyfy):

```
Frontend:     Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui
Backend:      Next.js Route Handlers + Server Actions
ORM:          Prisma
Database:     MySQL (a ser fornecido/importado pelo Álvaro)
Auth:         NextAuth v5 — Google OAuth (+ credenciais) — sessão JWT (ver ADR-0003)
Pagamento:    Stripe (já integrado no base) — reavaliar Asaas/PIX (ver ADR-0004)
Imagens:      Cloudinary (já integrado no base)
Email:        Resend
Deploy:       Vercel
Design:       Sistema de cores pastéis "Arte & Tradição" (ver Parte 5)
```

### Autenticação — Google + JWT
Requisito do Álvaro: login pelo Google com acesso via **JWT**, seguindo os padrões usados. O base atual usa `session.strategy: "database"`. A migração para `strategy: "jwt"` está registrada em [`docs/adr/0003-autenticacao-google-jwt.md`](docs/adr/0003-autenticacao-google-jwt.md) — **decisão a confirmar** antes de implementar.

---

## Parte 5 — Identidade visual (cores pastéis)

Paleta inspirada na arte sacra e na tradição católica — **pastel, quente e reverente**, longe do "CSS padrão de IA":

| Papel | Cor | Inspiração |
|---|---|---|
| Fundo (creme) | `#FBF6EC` | Pergaminho / marfim antigo |
| Primária (dourado suave) | `#C9A24B` | Folha de ouro dos ícones |
| Secundária (sálvia) | `#A9BFA2` | Verde litúrgico suave |
| Azul mariano | `#A9C1D9` | Manto de Nossa Senhora |
| Rosa/blush | `#E4C3C0` | Rosa de Santa Teresinha |
| Texto (marrom-carvão) | `#3B322E` | Madeira / tinta antiga |

Tokens implementados em `src/app/(site)/theme-arte.css`. Princípio: cores dessaturadas, muito espaço em branco, tipografia serifada elegante para títulos (herança) + sans para corpo (legibilidade).

---

## Parte 6 — Sequencer (releases)

| Release | Foco | Saída concreta |
|---|---|---|
| **R0 — Casca** *(atual)* | Base + spec-driven + design pastel + landing | Plataforma navegável com as 3 áreas esboçadas |
| **R1 — Site + Catálogo** | Site de divulgação + catálogo público | Divulgação dos 3 produtos, SEO, páginas dos Santos |
| **R2 — E-commerce** | Carrinho + checkout + conta + pedidos | Venda funcional dos produtos físicos |
| **R3 — Admin** | Painel de produtos, estoque, pedidos | Operação centralizada |
| **R4 — Álbum de Figurinhas** | Motor de coleção (adapta Chaves) | Colecionar via QR + álbum digital |
| **R5 — Jogo da Memória digital** | Versão digital do jogo | Jogar online, ranking |
| **R6 — Polimento** | SEO, performance, acessibilidade | Lançamento |

---

## Parte 7 — Constituição (princípios invioláveis)

Ver [`.specify/memory/constitution.md`](.specify/memory/constitution.md). Resumo:

1. **Fidelidade iconográfica** — a representação dos Santos é reverente e correta. É requisito, não estética.
2. **Mobile-first** — se quebra no celular, não está pronto.
3. **Spec antes do código** — se a spec não está clara, não codifica.
4. **Physical-to-digital** — todo produto físico tem contrapartida ou continuidade digital.
5. **Privacidade e LGPD** — dados pessoais ao mínimo; consentimento explícito.
6. **Acessibilidade** — WCAG 2.1 AA como meta (o público inclui idosos e crianças).
7. **Reversibilidade** — nada de migração destrutiva sem backup; ação admin é logada.
8. **Reuso consciente** — reaproveitar o motor do Courtesyfy onde couber (figurinhas), sem carregar dívida que não serve ao novo domínio.

---

## Apêndice — Como evoluir este documento

1. Mudanças de visão / personas / produtos → editam **este** documento.
2. Mudanças de feature → editam a spec específica em `specs/NNN-feature/spec.md`.
3. Decisões técnicas → criam ADR em `docs/adr/`.
4. Aprendizados de operação → `docs/runbooks/`.

Nada de "v2 do documento". O git é o histórico.

---

*Elaborado com Claude (Anthropic) a partir da conversa com Álvaro — Arte & Tradição. Julho/2026.*
