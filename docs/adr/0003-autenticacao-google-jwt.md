# ADR-0003: Autenticação — Google OAuth + sessão JWT

## Status
Proposto — **decisão a confirmar com o Álvaro**

## Contexto
Requisito: "login pelo Google e com acesso com JWT, como os padrões que estamos usando". O base (Courtesyfy) usa NextAuth v5 com Google **já configurado**, porém com `session: { strategy: "database" }` (sessões persistidas na tabela `Session` via PrismaAdapter customizado). O `src/lib/auth.ts` também tem provider de credenciais e um `customAdapter`.

## Decisão (proposta)
Manter Google OAuth e migrar a estratégia de sessão para **`strategy: "jwt"`**, movendo `role` e `lojaId`/contexto para o callback `jwt` e expondo via callback `session`. Sessão de 30 dias.

**Ponto de atenção:** o `customAdapter` atual implementa `createSession/getSessionAndUser/updateSession/deleteSession` — com JWT essas sessões de banco deixam de ser usadas. Precisamos validar impacto no fluxo de verificação de e-mail e no vínculo de contas OAuth antes de trocar. Por isso: **decisão a confirmar** antes de implementar.

## Consequências
**Ganhamos:** menos escrita no banco por request, alinhamento com o padrão JWT pedido, sessão stateless.
**Perdemos:** revogação imediata de sessão (JWT vale até expirar); precisa cuidado com dados sensíveis no token.

## Alternativas consideradas
- **Manter database sessions:** já funciona, mas diverge do pedido explícito de JWT.
- **JWT + lista de revogação (upstash):** melhor dos dois mundos; considerar se revogação imediata virar requisito.
