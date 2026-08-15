import QRCode from "qrcode"

/**
 * Gera um QR Code como data URL (PNG). Preto sobre branco para máxima
 * legibilidade na impressão da embalagem.
 */
export async function gerarQrPng(texto: string, tamanho = 640): Promise<string> {
  return QRCode.toDataURL(texto, {
    width: tamanho,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
  })
}
