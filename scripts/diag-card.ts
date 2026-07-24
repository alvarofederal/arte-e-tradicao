import "dotenv/config"
import sharp from "sharp"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()

async function main() {
  const cards = await db.cardSanto.findMany({ orderBy: { numero: "asc" } })
  console.log("nº  | nome                          | imagem | dimensões  | ratio | posY | scale")
  for (const c of cards) {
    let dim = "—", ratio = "—"
    if (c.imagem) {
      const b64 = c.imagem.split(",")[1] ?? ""
      const buf = Buffer.from(b64, "base64")
      const meta = await sharp(buf).metadata()
      dim = `${meta.width}x${meta.height}`
      ratio = ((meta.width ?? 1) / (meta.height ?? 1)).toFixed(3)
    }
    const e = c.estilo as Record<string, unknown>
    console.log(
      `${String(c.numero).padStart(3, "0")} | ${c.nome.padEnd(29).slice(0, 29)} | ${c.imagem ? "sim   " : "não   "} | ${dim.padEnd(10)} | ${ratio.padEnd(5)} | ${String(e.imgPosY ?? "-").padEnd(4)} | ${e.imgScale ?? "-"}`
    )
  }
}

main().catch(console.error).finally(() => db.$disconnect())
