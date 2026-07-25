// Tipos compartilhados entre o server action e o cliente (sem "use server").
export type BordaEstilo = "nenhuma" | "solida" | "dupla" | "classica"

export interface CardEstilo {
  frenteBg: string
  frenteBg2: string
  usarGradiente: boolean
  faixaCor: string
  nomeCor: string
  subtituloCor: string
  brilho: boolean
  holografico: boolean
  bordaEstilo: BordaEstilo
  bordaCor: string
  bordaLargura: number
  versoBg: string
  versoTextoCor: string
  acento: string
  // manipulação da imagem (enquadramento)
  imgScale: number  // zoom (1 = normal)
  imgPosX: number   // posição horizontal 0–100 (%)
  imgPosY: number   // posição vertical 0–100 (%)
}

/** Visão achatada usada para renderizar o card (conteúdo + estilo). */
export type CardView = CardEstilo & {
  numero: number | null
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
}

export function cardToView(c: CardRegistro): CardView {
  return {
    ...c.estilo,
    numero: c.numero,
    nome: c.nome,
    dataFesta: c.dataFesta,
    descricao: c.descricao,
    imagem: c.imagem,
  }
}

/** O número é global e único. Em branco na criação = próximo da sequência. */
export interface SalvarCardInput {
  id?: string | null
  numero: number | null
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
  estilo: CardEstilo
}

export interface CardRegistro {
  id: string
  numero: number | null
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
  estilo: CardEstilo
  atualizadoEm: string
}

/** Formata o número no padrão da coleção: 7 → "007". */
export function formatarNumero(n: number | null | undefined): string {
  return n == null ? "" : String(n).padStart(3, "0")
}

/** Embaralha (Fisher-Yates) e devolve N itens aleatórios — para sortear cards. */
export function amostraAleatoria<T>(itens: T[], n: number): T[] {
  const a = [...itens]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, Math.max(0, Math.min(n, a.length)))
}

/** Proporção (largura/altura) da área de imagem do card, já sem a faixa do nome. */
export const CARD_FRAME_RATIO = 0.885

/**
 * Enquadramento inicial de uma imagem no card.
 *
 * Em arte sacra o rosto fica quase sempre no topo. Centralizar (50%) corta o
 * mesmo tanto em cima e embaixo — e em pinturas de corpo inteiro isso decepa a
 * cabeça. Aqui calculamos a posição vertical para que apenas ~4% do topo seja
 * cortado, qualquer que seja a proporção da imagem.
 */
export function enquadramentoInicial(largura: number, altura: number): number {
  if (!largura || !altura) return 50
  const cortada = 1 - largura / altura / CARD_FRAME_RATIO // fração perdida na altura
  if (cortada <= 0.001) return 50 // imagem deitada: não corta em cima
  const pos = (0.04 / cortada) * 100
  return Math.max(0, Math.min(50, Math.round(pos)))
}
