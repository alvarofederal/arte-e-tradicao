# ADR-0002: Reuso do motor de Chaves (cortesias) para o Álbum de Figurinhas

## Status
Proposto

## Contexto
O álbum de figurinhas precisa de: código único impresso no produto → escanear/digitar → revelar figurinha → vincular a um colecionador de forma imutável. O Courtesyfy já faz isso com `Campanha → LoteChave → Chave → /c/[codigo] → ativação → resgate`, com geração de código seguro (sem caracteres ambíguos) e `LogEvento`.

## Decisão
Reaproveitar a mecânica de Chaves como base do álbum, mapeando `Campanha→Coleção`, `LoteChave→LoteFigurinha`, `Chave→CódigoFigurinha`. A **decisão fina** — *adaptar/renomear as tabelas existentes* vs. *criar novas tabelas de domínio e aposentar as de cortesia* — será tomada no `/planejar` da spec 006, considerando o schema real do banco que o Álvaro fornecerá.

## Consequências
**Ganhamos:** geração de código, QR, unicidade, imutabilidade e auditoria já resolvidos e testados.
**Novo a construir:** mapeamento código→figurinha, raridade, repetidas, estado de completude do álbum, colagem self-service (sem operador).

## Alternativas consideradas
- **Sistema de coleção do zero:** mais aderente ao domínio, mas reescreve algo já robusto.
- **Reuso literal sem renomear:** rápido, mas fere a clareza de domínio (Constituição §8).
