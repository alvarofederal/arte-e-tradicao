/**
 * Recalcula o enquadramento vertical dos cards que já têm imagem.
 *
 * Motivo: o padrão antigo centralizava a imagem (50%), o que cortava a cabeça
 * dos Santos em pinturas de corpo inteiro. Agora a posição é calculada para
 * preservar o topo (rosto).
 *
 * Rode com: npx tsx scripts/reenquadrar.ts
 */
import "dotenv/config"
import sharp from "sharp"
import { PrismaClient } from "../src/generated/prisma"
import { enquadramentoInicial } from "../src/app/(panel)/dashboard/cards/_actions/cards-shared"

const db = new PrismaClient()

async function main() {
  const cards = await db.cardSanto.findMany({
    where: { imagem: { not: null } },
    orderBy: { numero: "asc" },
  })

  if (cards.length === 0) {
    console.log("Nenhum card com imagem.")
    return
  }

  for (const c of cards) {
    const b64 = (c.imagem ?? "").split(",")[1] ?? ""
    const meta = await sharp(Buffer.from(b64, "base64")).metadata()
    const posY = enquadramentoInicial(meta.width ?? 0, meta.height ?? 0)

    const estiloAtual = c.estilo as Record<string, unknown>
    const anterior = Number(estiloAtual.imgPosY ?? 50)
    await db.cardSanto.update({
      where: { id: c.id },
      data: { estilo: { ...estiloAtual, imgPosY: posY } },
    })

    console.log(
      `  #${String(c.numero).padStart(3, "0")} ${c.nome.padEnd(32).slice(0, 32)} ` +
      `${meta.width}x${meta.height}  topo ${anterior}% → ${posY}%`
    )
  }

  console.log(`\n✔ ${cards.length} card(s) reenquadrado(s). Ajuste fino no editor, se precisar.`)
}

main().catch(console.error).finally(() => db.$disconnect())
