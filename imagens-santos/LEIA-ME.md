# Imagens dos Santos

Coloque aqui os arquivos de imagem para anexar aos cards.

## Como nomear
O arquivo precisa **começar com o número do card**. O resto do nome é livre:

```
001.jpg
002 - perpetuo socorro.png
003_sagrada-familia.jpeg
014 sao joao da cruz.webp
```

Formatos aceitos: `.jpg` `.jpeg` `.png` `.webp` `.avif`

## Como anexar

```bash
npx tsx scripts/anexar-imagens.ts
```

O script redimensiona (máx. 1400 px de largura, respeitando a orientação da foto),
converte e grava a imagem no card correspondente. Ao final ele lista quais cards
ainda estão sem imagem.

Pode rodar quantas vezes quiser — anexar de novo simplesmente substitui a imagem.

## Catálogo atual

| Nº | Santo |
|----|-------|
| 001 | Nossa Senhora de Guadalupe |
| 002 | Nossa Senhora do Perpétuo Socorro |
| 003 | Sagrada Família |
| 004 | Imaculada Conceição |
| 005 | Imaculado Coração de Maria |
| 006 | Santo Inácio de Loyola |
| 007 | Santo Afonso Maria de Ligório |
| 008 | São João Bosco |
| 009 | São Bento |
| 010 | São José |
| 011 | São Francisco de Sales |
| 012 | Santo Tomás de Aquino |
| 013 | São Camilo de Léllis |
| 014 | São João da Cruz |

> As imagens ficam **fora do git** (só este arquivo é versionado) — elas são
> gravadas no banco ao rodar o script.
