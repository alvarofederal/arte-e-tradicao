/** Formata centavos em Real: 8990 → "R$ 89,90". */
export function formatBRL(centavos: number): string {
  return "R$ " + (centavos / 100).toFixed(2).replace(".", ",")
}
