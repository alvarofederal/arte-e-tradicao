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

/** O número é global, sequencial e permanente — atribuído pelo servidor, nunca digitado. */
export interface SalvarCardInput {
  id?: string | null
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
