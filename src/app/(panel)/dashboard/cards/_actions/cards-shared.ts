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
}

export interface SalvarCardInput {
  id?: string | null
  numero: string
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
  estilo: CardEstilo
}

export interface CardRegistro {
  id: string
  numero: string
  nome: string
  dataFesta: string
  descricao: string
  imagem: string | null
  estilo: CardEstilo
  atualizadoEm: string
}
