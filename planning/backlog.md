# Arte & Tradição — Backlog

> Lista viva de tarefas. A fonte de verdade de cada feature é a spec em [`specs/`](../specs); aqui é a visão priorizada do que fazer.
>
> Prioridade: 🔴 Crítico · 🟠 Alta · 🟡 Média · 🟢 Baixa · Status: `[x]` feito · `[~]` em andamento · `[ ]` a fazer
>
> Backlog do projeto base preservado em [`docs/referencia/backlog-courtesyfy.md`](../docs/referencia/backlog-courtesyfy.md).

---

## ✅ Concluído

- [x] Casca da plataforma + fundação spec-driven (specs, ADRs, comandos) — [`spec 000`](../specs/000-plataforma-base/spec.md)
- [x] Landing de divulgação em cores pastéis (esboço) — [`spec 001`](../specs/001-site-divulgacao/spec.md)
- [x] Login por e-mail/senha funcionando + usuário admin (seed via `.env`)
- [x] **Estúdio de Cards** — lista + cadastro/alteração, persistência (`CardSanto`), padrão figurinha (moldura, número, faixa com nome + igrejinha + data) — [`spec 007`](../specs/007-gerador-de-cards/spec.md)
- [x] Enquadramento da imagem (zoom + posição) e **prévia de impressão A4** (frente + verso)

---

## A. Cards / Impressão 🟠 *(frente ativa — continuação direta)*
Ref.: [`spec 007`](../specs/007-gerador-de-cards/spec.md)

- [ ] 🟠 **Grade A4 com pares** — vários cards por folha, cada Santo em **2 cópias** (jogo da memória), com marcas de corte *(próximo passo sugerido)*
- [ ] 🟡 Impressão **frente-e-verso alinhada** (duplex)
- [ ] 🟡 Trocar a **igrejinha genérica** pelo ícone oficial da Arte & Tradição *(depende do Álvaro enviar o SVG/PNG)*
- [ ] 🟡 **Arrastar a imagem** no preview para reposicionar (hoje só sliders)
- [ ] 🟢 Sangria/*bleed* de impressão (margem de corte)
- [ ] 🟢 Mover a imagem do card para o **Cloudinary** (hoje dataURL no banco)

## B. Adaptar o painel (remover "Courtesyfy") 🟠

- [ ] 🟠 **Rebranding** do login e da sidebar (ainda aparece "Courtesyfy") → logo + cores Arte & Tradição
- [ ] 🟡 Esconder/adaptar itens de menu do Courtesyfy (Campanhas, Chaves, Lojas, Stripe) que ainda não pertencem à Arte & Tradição
- [ ] 🟡 UX de **sessão expirada** — não perder o trabalho da tela (avisar / manter rascunho)

## C. Áreas da plataforma (grandes releases)

- [ ] 🟠 **Coleções + Álbum de figurinhas** — agrupar cards em Coleção, gerar códigos/QR, álbum digital (reaproveita motor de Chaves) — [`spec 006`](../specs/006-produto-album-figurinhas/spec.md)
- [ ] 🟠 **Área administrativa** — produtos, estoque, pedidos, métricas — [`spec 003`](../specs/003-area-administrativa/spec.md)
- [ ] 🟡 **Site de divulgação** — conteúdo, páginas dos Santos, SEO — [`spec 001`](../specs/001-site-divulgacao/spec.md)
- [ ] 🟡 **E-commerce / Loja** — catálogo real, carrinho, checkout, conta — [`spec 002`](../specs/002-ecommerce/spec.md)
- [ ] 🟢 **Jogo da memória digital** (jogar online) — [`spec 005`](../specs/005-produto-jogo-memoria/spec.md)

## D. Decisões em aberto (ADRs)

- [ ] 🟡 **Auth Google + JWT** — hoje é sessão de banco por credenciais — [`ADR-0003`](../docs/adr/0003-autenticacao-google-jwt.md)
- [ ] 🟡 **Pagamento** — Stripe atual vs. Asaas/PIX no e-commerce — [`ADR-0004`](../docs/adr/0004-pagamento-stripe-vs-asaas.md)

## E. Qualidade / dívidas técnicas

- [ ] 🟡 Adaptar o **schema** (`Loja/Campanha/Chave` → domínio Arte & Tradição) conforme cada spec avança
- [ ] 🟡 Testes obrigatórios (geração de código das figurinhas, regras de coleção, billing) — Constituição §9
- [ ] 🟢 Limpar contexto legado do base (`context/`, `knowledge/`, `planning/*` ainda descrevem o Courtesyfy)
- [ ] 🟢 Validação tipada de env vars no startup (Zod)

---

## Ideias futuras (não priorizadas)

- Troca de figurinhas repetidas entre colecionadores
- Raridades (comum / prata / dourada / brilhante) nas figurinhas
- Ranking do jogo da memória online
- Compra em volume com nota fiscal (paróquias — persona Padre Marcos)
- App/PWA para o álbum

---

*Registrado em: 2026-07-22*
