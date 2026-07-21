---
description: Cria o plano técnico de implementação (o "como") a partir da spec da feature
argument-hint: <número/nome da feature, ex: 006-produto-album-figurinhas>
---

Você vai produzir o **plano técnico** (`plan.md`) de uma feature já especificada, no fluxo Spec-Driven da Arte & Tradição.

Contexto obrigatório:
1. Leia `specs/$ARGUMENTS/spec.md` (a feature alvo).
2. Leia `spec.md` (mestra), a constituição e os ADRs relevantes em `docs/adr/`.
3. Inspecione o código real do base afetado (Prisma `prisma/schema.prisma`, `src/lib/`, rotas) — não presuma.

Escreva `specs/$ARGUMENTS/plan.md` com: **Abordagem técnica**, **Mudanças no schema Prisma** (models/enums, com nota se é migração destrutiva — exige confirmação, Constituição §7), **Rotas/Server Actions e contratos**, **Componentes de UI**, **Reuso do base vs. novo código**, **Testes obrigatórios** (billing, geração de código, regras de coleção), **Riscos técnicos** e **Decisões que viram ADR**.

Se uma decisão arquitetural nova aparecer, proponha um ADR em `docs/adr/`. Não escreva código de produção ainda — só o plano. Ao terminar, pergunte se pode seguir para `/tarefas`.
