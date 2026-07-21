# Constituição do Projeto — Arte & Tradição

> Princípios invioláveis lidos em toda execução spec-driven. Se uma decisão fere um princípio, ou o princípio muda (com justificativa registrada) ou a decisão é revista.

## 1. Fidelidade iconográfica
A representação dos Santos é **reverente e correta**. Nome, atributos, símbolos, cores litúrgicas e datas seguem a tradição da Igreja Católica Apostólica Romana. Erro de iconografia é bug de severidade alta, não detalhe estético.

## 2. Mobile-first
O público usa celular. Se a experiência quebra no mobile, a feature **não está pronta**. Testar em telas pequenas antes de considerar concluído.

## 3. Spec antes do código (single source of truth)
Nenhuma feature vira código sem uma spec clara em `specs/NNN-*/spec.md`. A spec é o contrato; o código é regenerável. Divergência entre código e spec → atualiza-se a spec no mesmo PR.

## 4. Physical-to-digital
Todo produto físico (quebra-cabeça, jogo, figurinha) tem contrapartida ou continuidade digital (ficha do Santo, álbum, jogo online). O elo físico↔digital é o diferencial estratégico.

## 5. Privacidade e LGPD por padrão
Coletamos o mínimo de dados pessoais. Consentimento explícito em cadastro e compra. Senha com bcrypt (cost ≥ 12), nunca logada. Rota de exclusão de dados disponível. Segredos só em `.env`, nunca commitados.

## 6. Acessibilidade (WCAG 2.1 AA)
Contraste, navegação por teclado, textos alternativos, tamanhos de toque adequados. O público inclui idosos (catequistas, avós) e crianças. Acessibilidade é mercado, não caridade.

## 7. Reversibilidade e auditoria
Nada de migração destrutiva de banco sem backup confirmado. Toda ação administrativa relevante gera `LogEvento`. `db push --accept-data-loss` exige confirmação explícita do Álvaro.

## 8. Reuso consciente do base (Courtesyfy)
Reaproveitamos o motor de **Chaves** do Courtesyfy para o **álbum de figurinhas** e a infra de auth/pagamento/upload. Mas não carregamos lógica de cortesias que não serve ao novo domínio — limpamos com intenção, spec por spec.

## 9. Testes onde importa
Lógica de pagamento, geração de códigos únicos (figurinhas) e regras de coleção têm testes obrigatórios. UI pode pular. O padrão de testes do base (`vitest`, `tests/unit` e `tests/integration`) é mantido.

## 10. Português do Brasil
Domínio, UI e vocabulário em pt-BR. `campanha`, `coleção`, `figurinha`, `álbum`, `colecionador`, `pedido`, `produto` — não os equivalentes em inglês.

---
*Base: Parte 10 da spec mestra. Atualizar aqui quando um princípio evoluir.*
