---
description: Cria/atualiza a spec de uma feature (o "o quê") no fluxo Spec-Driven da Arte & Tradição
argument-hint: <número e nome da feature ou descrição do que especificar>
---

Você vai produzir uma **especificação de feature** para a plataforma Arte & Tradição, seguindo o método Spec-Driven (o "o quê", nunca o "como" técnico detalhado — isso é o `/planejar`).

Contexto obrigatório antes de escrever:
1. Leia a spec mestra `spec.md`.
2. Leia a constituição `.specify/memory/constitution.md` — a spec não pode ferir os princípios.
3. Veja specs existentes em `specs/` para manter numeração e estilo.

Alvo: $ARGUMENTS

Passos:
- Determine o número/pasta da feature (`specs/NNN-nome-curto/`). Se já existe, atualize; senão, crie.
- Escreva `specs/NNN-nome-curto/spec.md` com as seções: **Contexto** (qual job/persona atende), **Critérios de aceite** (lista testável, cada item verdadeiro/falso), **Não-objetivos**, **Fluxos** (principal + exceção), **Modelo de dados afetado** (rascunho), **Dependências**, **Riscos**, **Métricas de sucesso**.
- Marque ambiguidades com `[A DEFINIR: ...]` em vez de inventar.
- Se a feature reaproveita algo do base (Courtesyfy), explicite o mapeamento.

Ao terminar, liste as ambiguidades pendentes e pergunte se pode seguir para `/planejar`.
