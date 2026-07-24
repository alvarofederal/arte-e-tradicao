# Spec 005 — Produto: Jogo da Memória dos Santos

> **Status:** Rascunho (novo produto) · **Release alvo:** físico em R2, digital em R5

## Contexto
Jogo de pares (memória) com os Santos. Pares associam o **Santo** ao seu **atributo/símbolo** (ex.: São Jorge ↔ dragão; Santa Luzia ↔ olhos; São Pedro ↔ chaves), ensinando iconografia brincando. Existe como produto físico (cartas) e, em fase futura, como jogo digital.

> **As cartas físicas são produzidas no Gerador de Cards** — ver [`specs/007-gerador-de-cards/spec.md`](../007-gerador-de-cards/spec.md). O jogo da memória é o **primeiro uso** do gerador: cards no tamanho de figurinha da Copa (~5×7 cm), sempre em **pares**, impressos em **folha A4**.

## Produção do jogo físico (implementado — jul/2026)

Tela **`/dashboard/memoria`**: o Álvaro seleciona os Santos do catálogo e o sistema monta o jogo.

- [x] Cada Santo selecionado vira **exatamente 1 par** (2 cards **iguais**) — **nunca mais que duas cópias**.
- [x] **Sem numeração** na frente (só imagem + nome) — a numeração é do card colecionável.
- [x] **Verso padrão com a logo Arte & Tradição**, **idêntico em todos os cards** — requisito do jogo: de costas as cartas não podem ser distinguíveis.
- [x] Contagem ao vivo: Santos → pares → cards → folhas A4.
- [x] Gabarito **4 × 4 = 16 cards por folha** (49 × 65 mm), com marcas de corte; **48 cards = 24 pares = 3 folhas** (atalho "Jogo padrão").
- [x] Folhas de frente e verso **intercaladas e espelhadas** para impressão duplex.

> Nota: o verso uniforme usa **cores fixas** (não as do card), garantindo que todos os versos saiam iguais.

## Critérios de aceite — produto físico (catálogo)
- [ ] Cadastro do produto: coleção de pares, nº de cartas, faixa etária, preço, imagens.
- [ ] Lista dos pares Santo↔atributo com fidelidade iconográfica revisada.
- [ ] Ficha devocional acessível (QR opcional nas cartas).

## Critérios de aceite — jogo digital (R5, esboço)
- [ ] Tabuleiro de memória jogável no navegador (mobile-first).
- [ ] Ao formar par, revela mini-ficha do Santo.
- [ ] Níveis por nº de pares; cronômetro/placar opcional.
- [ ] Sem cadastro obrigatório para jogar; ranking exige conta.

## Não-objetivos
- Multiplayer online (fase futura).

## Notas de domínio
O mapa Santo↔atributo é um dado de domínio reutilizável (também útil na spec 006). Considerar uma fonte única de verdade de "Santos e seus atributos".
