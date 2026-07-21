# Spec 000 — Plataforma Base (casca inicial)

> **Status:** Em andamento (Release 0) · **Depende de:** projeto Courtesyfy (base)

## Contexto
Transformar o clone do Courtesyfy na casca da plataforma Arte & Tradição: identidade visual pastel, rebranding, estrutura das três áreas (site, e-commerce, admin) e fundação spec-driven. Preserva o encanamento reutilizável (auth, Prisma, pagamento, upload) para adaptação incremental.

## Critérios de aceite
- [x] Estrutura spec-driven criada (`spec.md`, `.specify/`, `specs/`, `docs/adr/`, comandos).
- [x] Sistema de design pastel "Arte & Tradição" (`(site)/theme-arte.css`).
- [x] Landing de divulgação com os 3 produtos e navegação para as 3 áreas.
- [x] Rebranding de metadados (título, descrição) para Arte & Tradição.
- [ ] `/loja` (esqueleto de e-commerce) navegável.
- [ ] Login pelo Google funcional na nova casca (JWT — ver ADR-0003).
- [ ] Painel Courtesyfy existente preservado e acessível para adaptação.

## Não-objetivos (R0)
- Migrar o schema do banco (o Álvaro fornecerá o banco depois).
- Implementar checkout/venda real.
- Remover a lógica de cortesias (será adaptada na spec 006).

## Fluxo principal
Visitante chega em `/` → vê a marca e os 3 produtos em cores pastéis → navega para a Loja, para as páginas de produto, ou faz login para a área administrativa.

## Riscos
- Conflito entre o tema escuro (Courtesyfy) e o tema pastel claro do site → isolar o tema do site em um grupo de rotas próprio.
- `node_modules` ausente → precisa `npm install` antes de rodar.
