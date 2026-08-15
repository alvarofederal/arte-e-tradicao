/**
 * Gera a vitrine dos Santos usada na landing pública.
 *
 * Por que estático? A home é pública e não pode depender do banco nem carregar
 * as imagens em base64 (centenas de KB cada). Aqui exportamos miniaturas leves
 * para public/santos/ (servidas pelo CDN) + um manifesto importado em build.
 *
 * Rode sempre que o catálogo mudar:  npx tsx scripts/gerar-vitrine.ts
 */
import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()

const LARGURA_MINIATURA = 260 // suficiente para a grade da home, inclusive em telas retina
// fora de /santos para não conflitar com a rota /santos/[slug]
const DIR_IMG = path.resolve(process.cwd(), "public", "catalogo")
const ARQ_MANIFESTO = path.resolve(process.cwd(), "src", "data", "vitrine.json")

interface ItemVitrine {
  numero: number
  nome: string
  dataFesta: string
  arquivo: string
  bordaCor: string
  faixaCor: string
  nomeCor: string
  subtituloCor: string
  imgPosX: number
  imgPosY: number
  imgScale: number
}

async function main() {
  fs.mkdirSync(DIR_IMG, { recursive: true })
  fs.mkdirSync(path.dirname(ARQ_MANIFESTO), { recursive: true })

  const cards = await db.cardSanto.findMany({
    where: { imagem: { not: null } },
    orderBy: { numero: "asc" },
  })

  if (cards.length === 0) {
    console.log("Nenhum card com imagem. Nada a gerar.")
    return
  }

  const vitrine: ItemVitrine[] = []

  for (const c of cards) {
    const b64 = (c.imagem ?? "").split(",")[1] ?? ""
    const buf = Buffer.from(b64, "base64")

    const nomeArq = `${String(c.numero).padStart(3, "0")}.jpg`
    const saida = await sharp(buf)
      .resize({ width: LARGURA_MINIATURA, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer()

    fs.writeFileSync(path.join(DIR_IMG, nomeArq), saida)

    const e = (c.estilo ?? {}) as Record<string, unknown>
    vitrine.push({
      numero: c.numero ?? 0,
      nome: c.nome,
      dataFesta: c.dataFesta ?? "",
      arquivo: `/catalogo/${nomeArq}`,
      bordaCor: String(e.bordaCor ?? "#C9A24B"),
      faixaCor: String(e.faixaCor ?? "#F5ECD6"),
      nomeCor: String(e.nomeCor ?? "#2E2A26"),
      subtituloCor: String(e.subtituloCor ?? "#3B322E"),
      imgPosX: Number(e.imgPosX ?? 50),
      imgPosY: Number(e.imgPosY ?? 50),
      imgScale: Number(e.imgScale ?? 1),
    })

    console.log(`  ✔ ${nomeArq}  ${c.nome}  (${Math.round(saida.length / 1024)} KB)`)
  }

  fs.writeFileSync(ARQ_MANIFESTO, JSON.stringify(vitrine, null, 2) + "\n")

  const total = vitrine.reduce((s, v) => s + fs.statSync(path.join(DIR_IMG, path.basename(v.arquivo))).size, 0)
  console.log(`\n✔ ${vitrine.length} Santos na vitrine — ${Math.round(total / 1024)} KB no total.`)
  console.log(`  imagens:   public/catalogo/`)
  console.log(`  manifesto: src/data/vitrine.json`)
}

main().catch(console.error).finally(() => db.$disconnect())
