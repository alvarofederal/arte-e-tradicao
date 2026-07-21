---
description: Executa as tarefas de uma feature seguindo spec + plano + tarefas
argument-hint: <número/nome da feature [e tarefa específica]>
---

Você vai **implementar** tarefas de uma feature já planejada, respeitando o Spec-Driven da Arte & Tradição.

Antes de codar (obrigatório):
1. Leia `specs/<feature>/spec.md`, `plan.md` e `tasks.md`.
2. Leia a constituição `.specify/memory/constitution.md` e os ADRs relevantes.
3. Confira padrões do base: `import { db } from "@/lib/prisma"`, `import { auth } from "@/lib/auth"`, validação com Zod em Server Actions/rotas, verificação de permissão por role.

Alvo: $ARGUMENTS

Regras:
- Implemente **uma tarefa por vez**; ao concluir, marque `[x]` em `tasks.md`.
- **Nunca** rode migração destrutiva de banco (`db push --accept-data-loss`) sem confirmação explícita do Álvaro (Constituição §7).
- Fidelidade iconográfica dos Santos é requisito (Constituição §1).
- Escreva os testes exigidos pela tarefa antes de considerá-la concluída.
- Se a implementação divergir da spec, **atualize a spec** no mesmo passo.
- Rode `npm run build` / testes relevantes para verificar. Reporte o que passou e o que falhou honestamente.

Comece confirmando qual tarefa vai implementar e o plano imediato.
