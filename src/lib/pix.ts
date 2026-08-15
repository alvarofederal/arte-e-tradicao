// Gerador de PIX "Copia e Cola" (BR Code / EMV MPM) com valor.
// Padrão Banco Central: TLV (id+len+value) + CRC16-CCITT no final.
// Config via env: PIX_CHAVE, PIX_NOME, PIX_CIDADE (definidas na Vercel).

export interface PixConfig {
  chave: string
  nome: string
  cidade: string
}

export function pixConfigurado(): PixConfig | null {
  const chave = process.env.PIX_CHAVE?.trim()
  const nome = process.env.PIX_NOME?.trim()
  const cidade = process.env.PIX_CIDADE?.trim()
  if (!chave || !nome || !cidade) return null
  return { chave, nome, cidade }
}

// Campo TLV: id (2 dígitos) + comprimento (2 dígitos) + valor.
function tlv(id: string, valor: string): string {
  const len = valor.length.toString().padStart(2, "0")
  return `${id}${len}${valor}`
}

// Remove acentos e caracteres fora do intervalo permitido; caixa alta; corta.
function limpar(txt: string, max: number): string {
  return txt
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim()
    .slice(0, max)
}

// CRC16-CCITT (polinômio 0x1021, inicial 0xFFFF).
function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

/**
 * Monta o payload PIX Copia-e-Cola.
 * @param cfg   chave/nome/cidade do recebedor
 * @param valorCentavos  valor total em centavos
 * @param txid  identificador da transação (ex.: número do pedido); "***" se ausente
 */
export function gerarPixCopiaCola(cfg: PixConfig, valorCentavos: number, txid = "***"): string {
  const valor = (valorCentavos / 100).toFixed(2) // ponto decimal, 2 casas
  const txidLimpo = limpar(txid.replace(/\s/g, ""), 25) || "***"

  const merchantAccount = tlv(
    "26",
    tlv("00", "br.gov.bcb.pix") + tlv("01", cfg.chave),
  )
  const additionalData = tlv("62", tlv("05", txidLimpo))

  const semCrc =
    tlv("00", "01") + // Payload Format Indicator
    tlv("01", "12") + // Point of Initiation Method (uso único)
    merchantAccount +
    tlv("52", "0000") + // Merchant Category Code
    tlv("53", "986") + // Moeda: BRL
    tlv("54", valor) + // Valor
    tlv("58", "BR") + // País
    tlv("59", limpar(cfg.nome, 25)) + // Nome do recebedor
    tlv("60", limpar(cfg.cidade, 15)) + // Cidade
    additionalData +
    "6304" // id + len do CRC (valor calculado a seguir)

  return semCrc + crc16(semCrc)
}
