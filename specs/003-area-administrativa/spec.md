# Spec 003 — Área Administrativa (Painel)

> **Status:** Rascunho · **Release alvo:** R3 · **Acesso:** role ADMIN

## Contexto
Painel único onde o Álvaro gerencia toda a operação: catálogo, estoque, pedidos, coleções de figurinhas e métricas. Reaproveita a estrutura de dashboard do base (`(panel)/dashboard`).

## Critérios de aceite
- [ ] Dashboard com KPIs: vendas, pedidos, receita, colecionadores ativos, estoque baixo.
- [ ] CRUD de **Produtos** (as 3 linhas), com variações, preço, imagens, ficha do Santo.
- [ ] Gestão de **Estoque**.
- [ ] Gestão de **Pedidos** (status, envio, rastreamento).
- [ ] Gestão de **Coleções e Figurinhas** + geração de **lotes de códigos** (spec 006).
- [ ] Visão de **álbuns dos usuários** (progresso agregado).
- [ ] `LogEvento` / auditoria pesquisável.
- [ ] Apenas role ADMIN acessa; middleware protege `/dashboard/*` e `/admin/*`.

## Não-objetivos
- Multi-tenant / white-label (o base tem `Loja`, mas aqui é operação única da Arte & Tradição).

## Riscos
Adaptar as telas de "campanhas/chaves" do base para "coleções/figurinhas" sem confundir domínio.
