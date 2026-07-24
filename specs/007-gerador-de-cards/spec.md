# Spec 007 — Gerador de Cards (figurinhas / cartas dos Santos)

> **Status:** Rascunho (direcionamento do Álvaro capturado) · **Usado por:** [005-jogo-memoria](../005-produto-jogo-memoria/spec.md) (inicialmente) e [006-album-figurinhas](../006-produto-album-figurinhas/spec.md)
>
> **Referência de qualidade:** a página de **configuração de figuras do Courtesyfy** ("bem redonda", nas palavras do Álvaro). Reaproveitar essa infra do base.

## Contexto
Ferramenta visual onde o Álvaro monta os **cards dos Santos**: sobe a imagem, escolhe a borda, edita o nome do Santo na frente e escreve uma descrição no verso. Os cards são gerados **aos pares** (jogo da memória) e diagramados para **impressão em folha A4**. A mesma ferramenta serve depois às figurinhas do álbum.

## Decisões de alinhamento (jul/2026) — **valem sobre o texto original abaixo**

1. **Propósito:** este módulo é **ferramenta interna de produção** (gerar → imprimir → recortar → vender). A venda é **privada** por ora; o e-commerce vem depois.
2. **São DUAS funcionalidades distintas**, com o mesmo catálogo de Santos:
   - **Card colecionável** → frente com **número**; verso **descritivo**.
   - **Jogo da memória** ([spec 005](../005-produto-jogo-memoria/spec.md)) → **2 cards iguais** por Santo, **sem numeração**, verso **padrão com a logo** (uniforme — senão dá para identificar a carta de costas).
3. **Tamanho real: 49 × 65 mm** (figurinha da Copa). Confirmado com foto de referência.
4. **Numeração:** **global, sequencial e permanente**. Atribuída pelo servidor (maior + 1), **nunca digitada** e **nunca alterada**. Motivo do Álvaro: o mesmo Santo precisa ter sempre o mesmo número para trocas entre colecionadores ("qual card sumiu?"). Card excluído **deixa buraco** — não renumera.
5. **Número fica na FRENTE** (como nas figurinhas de referência). *O pedido anterior de colocá-lo no verso foi retificado pelo Álvaro.*
6. **Gabarito A4: 4 colunas × 3 linhas = 12 cards por folha**, com ~2 mm entre eles e linha tracejada de corte. 4 folhas = 48 cards.
7. **Frente e verso intercalados e espelhados** para impressão duplex (o verso cai atrás da frente certa).

## Requisitos do Álvaro (capturados literalmente)
1. **Gerador de imagens** parecido com o do Courtesyfy (upload + configuração visual do card).
2. **Upload do card**: subir a imagem base do Santo.
3. **Bordas diversas**: escolher entre várias molduras/bordas para o card.
4. **Frente do card** — texto **editável** com o **nome do Santo**, posicionado na **área brilhosa** (efeito brilho/holográfico/foil).
5. **Verso do card** — campo para uma **descrição bonita** do Santo.
6. **Tamanho** = figurinha da Copa (padrão **Panini ≈ 5 cm × 7 cm**). `[A DEFINIR: confirmar medida exata e sangria/bleed]`.
7. **Sempre em pares** (par a par), porque **inicialmente é o jogo da memória**.
8. **Impressão em folha A4** (diagramação de N cards por página, com marcas de corte).

## Critérios de aceite
- [x] Tela de criação do card com preview ao vivo (frente e verso) — `dashboard/cards`.
- [x] Upload da imagem *(1ª versão via dataURL local + autosave; **pendente**: subir para Cloudinary `/api/upload` ao persistir)*.
- [x] Seletor de **borda** configurável (clássica dourada / sólida / dupla / nenhuma + cor + espessura). *Pendente: galeria de molduras ornamentais.*
- [x] Campo de **nome do Santo** na frente, sobre a **área brilhosa** (foil + holográfico opcional); cor ajustável.
- [x] Campo de **descrição** no verso, com tipografia serifada.
- [x] Card no tamanho **figurinha (~5×7 cm)**. *Pendente: sangria/bleed para impressão.*
- [x] Exportar cada lado como **PNG** em escala de impressão (3×).
- [x] **Salvar no banco** para reedição (modelo `CardSanto`, tabela `cards_santos`).
- [x] **Listagem** em `/dashboard/cards` (grade dos Santos, com Alterar/Excluir) + telas próprias de **cadastro** (`/novo`) e **alteração** (`/[id]`).
- [ ] Geração **em pares idênticos** (2 cópias por Santo) para o jogo da memória.
- [ ] Diagramação **A4** para impressão (grade com marcas de corte), reusando o layout de impressão do base.

> **Implementado na R0** (`src/app/(panel)/dashboard/cards/`): editor client-side com controle total de imagem e cores, preview frente/verso, foil/holográfico, export PNG, **persistência no banco** (modelo `CardSanto` + server actions `salvarCard`/`listarCards`/`excluirCard` com Zod) e galeria "Meus cards". A imagem é otimizada no upload (≤900px, JPEG) e guardada como dataURL. **Próximos passos**: mover imagem para Cloudinary, **pares** e **diagramação A4**.

## Não-objetivos (v1)
- Editor gráfico livre (tipo Canva). Foco: template com campos controlados.
- Impressão sob demanda por terceiros / gráfica integrada.

## Reuso do base (Courtesyfy)
| Necessidade | Onde já existe no base |
|---|---|
| Config visual do card ("página de figuras") | `src/app/(panel)/dashboard/layout/_components/card-renderer.tsx` |
| Renderização do card | `card-renderer.tsx` |
| Diagramação/impressão A4 | `src/app/print/layout/_components/print-layout-client.tsx`, `dashboard/chaves/lote/[loteId]/imprimir/_components/print-grid.tsx` |
| Upload de imagem | `/api/upload` (Cloudinary) |
| Tamanhos de card | enum `TamanhoCard` (add **FIGURINHA ~5×7cm**) |
| Estilos/bordas | enum `EstiloCard` (add molduras) + novo catálogo de bordas |
| Formato de saída | enum `FormatoSaida` (**A4** já existe) |

## Modelo de dados afetado (rascunho — detalhar em /planejar)
`CardTemplate` (santoNome, imagemUrl, bordaId, descricaoVerso, tamanho, estilo, brilho/efeito). Para o jogo da memória: um conjunto (`BaralhoMemoria`) referencia N pares. Ligação com produto (spec 005) e com figurinha/coleção (spec 006).

## Riscos
- Fidelidade da cor/impressão (o que aparece na tela vs. impresso) — calibrar CMYK/sangria.
- Efeito "brilhoso" na tela é só simulação; o brilho real depende do acabamento de impressão (verniz/holográfico) — alinhar expectativa.
- Fidelidade iconográfica do Santo (Constituição §1).

## Métricas de sucesso
Tempo para o Álvaro montar um baralho completo; qualidade de impressão aprovada; reaproveitamento no álbum (spec 006) sem retrabalho.
