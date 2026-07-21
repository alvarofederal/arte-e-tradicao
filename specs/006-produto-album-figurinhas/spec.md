# Spec 006 — Álbum de Figurinhas dos Santos

> **Status:** Rascunho (esqueleto) · **Release alvo:** R4 · **Depende de:** 000-plataforma-base, 003-area-administrativa, auth (Google+JWT)
>
> Esta é a feature que **reaproveita a mecânica de cortesias do Courtesyfy**. O pedido do Álvaro: "vamos fazer o que mais ou menos fizemos no Courtesify para criar as cortesias".

## Contexto

O álbum de figurinhas é uma **coleção devocional lúdica**: o cliente compra um produto físico (pacotinho, quebra-cabeça, etc.) que traz um **código único**. Ao escanear o QR / digitar o código, uma **figurinha de um Santo é revelada e colada no álbum digital** do colecionador. O álbum mostra progresso (ex.: 42/60), incentiva completar a coleção e, em fases futuras, permite **troca de repetidas** entre colecionadores.

É catequese pelo colecionar: cada figurinha traz a imagem e a mini-história de um Santo.

## Reaproveitamento do motor do Courtesyfy (mapeamento)

O Courtesyfy cria "cortesias" assim: `Loja` cria uma `Campanha`, gera um `LoteChave` com N `Chave`s (códigos únicos `XXXX-XXXX-XXXX-XXXX` com entropia segura, sem caracteres ambíguos), imprime com QR apontando para `/c/[codigo]`; o cliente escaneia, **ativa** (vincula tel/email) e depois **resgata** (operador valida, chave vira imutável). Cada passo gera `LogEvento`.

Mapeamos 1:1 para figurinhas:

| Courtesyfy | Arte & Tradição (figurinhas) | Observação |
|---|---|---|
| `Campanha` | **Coleção** | Ex.: "Santos do Brasil" (60 figurinhas) |
| `LoteChave` | **Lote de figurinhas** | Impressão de N códigos de uma coleção |
| `Chave` (código único) | **Código da figurinha** | Impresso no produto/pacotinho |
| QR → `/c/[codigo]` | QR → `/f/[codigo]` (revela a figurinha) | Rota pública |
| `Ativação` | **Vincular ao colecionador** | Requer conta (Google/JWT) |
| `Resgate` (imutável) | **Colar no álbum** | A figurinha entra na coleção do usuário |
| `Cliente` | **Colecionador** (User) | |
| `LogEvento` | Histórico de aberturas | Auditoria |

**O que difere das cortesias (novo comportamento a implementar):**
1. Um código revela **qual** figurinha (mapeamento código → Santo), possivelmente com **raridade** (comum / prata / dourada / brilhante).
2. Figurinhas **repetidas** são permitidas e alimentam a mecânica de troca (fase futura).
3. O álbum tem **estado de completude** por usuário e por coleção.
4. A "colagem" é do colecionador (self-service), não de um operador de balcão.

## Critérios de aceite (R4 — MVP do álbum)

- [ ] Admin cria uma **Coleção** com metadados (nome, tema, nº de figurinhas, capa) e cadastra as figurinhas (Santo, imagem, raridade, mini-ficha).
- [ ] Admin gera um **lote de códigos** para a coleção (reusa geração de código único do base — `nanoid`/entropia segura, sem chars ambíguos).
- [ ] Rota pública `/f/[codigo]` mostra a figurinha revelada e CTA "Adicionar ao meu álbum".
- [ ] Usuário autenticado (Google/JWT) **cola** a figurinha: registra vínculo colecionador↔figurinha, código marcado como usado (imutável).
- [ ] Código já usado por outra conta → mensagem clara (não permite roubo de figurinha).
- [ ] Página `/minha-conta/album` mostra o álbum com slots preenchidos/vazios e progresso `X/N`.
- [ ] Cada figurinha colada é clicável → mini-ficha do Santo.
- [ ] Todo evento (revelar, colar) gera log de auditoria.

## Não-objetivos (R4)
- Troca de repetidas entre colecionadores (fica para fase futura).
- Marketplace de figurinhas.
- Figurinhas puramente digitais compradas avulsas (v1 exige o código físico).

## Modelo de dados afetado (rascunho — a detalhar em /planejar)
Reaproveita/renomeia do base: `Campanha`→`Colecao`, `LoteChave`→`LoteFigurinha`, `Chave`→`CodigoFigurinha`. Novos: `Figurinha` (Santo, imagem, raridade, colecaoId), `AlbumUsuario` (userId, colecaoId, progresso), `FigurinhaColada` (userId, figurinhaId, codigoId, coladaEm). Decisão de "adaptar tabelas existentes vs. criar novas" fica no `/planejar` + ADR.

## Riscos
- **Fraude de código** (adivinhar/forçar códigos): mitigar com entropia alta + rate limit (infra `upstash` já existe no base).
- **Iconografia incorreta**: revisão de fidelidade antes de publicar coleção (Constituição §1).
- **Confusão de domínio** ao reusar tabelas de cortesia: preferir renomear/migrar com clareza a sobrecarregar semântica.

## Métricas de sucesso
Taxa de colagem (códigos revelados que viram figurinha colada), álbuns completados, colecionadores ativos por coleção.
