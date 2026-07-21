---
description: Quebra o plano técnico da feature em tarefas atômicas e executáveis
argument-hint: <número/nome da feature, ex: 006-produto-album-figurinhas>
---

Você vai transformar o plano técnico de uma feature em uma **lista de tarefas** executáveis.

Contexto obrigatório:
1. Leia `specs/$ARGUMENTS/spec.md` e `specs/$ARGUMENTS/plan.md`.

Escreva `specs/$ARGUMENTS/tasks.md` como uma checklist ordenada. Cada tarefa deve:
- Ser atômica (um PR pequeno, idealmente < 1 dia).
- Ter dependências explícitas (o que precisa estar pronto antes).
- Indicar arquivos prováveis a tocar.
- Marcar tarefas com teste obrigatório (Constituição §9).
- Separar claramente: migração de schema → backend → UI → testes → verificação.

Ordene por dependência e risco (o mais arriscado/fundacional primeiro). Ao terminar, pergunte se pode seguir para `/implementar` (e por qual tarefa começar).
