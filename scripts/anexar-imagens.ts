/**
 * Anexa as imagens dos Santos aos cards já cadastrados.
 *
 * COMO USAR
 *   1. Salve as imagens na pasta  imagens-santos/  (na raiz do projeto)
 *   2. Nomeie cada arquivo começando pelo número do card:
 *        001.jpg        002 - perpetuo socorro.png        3_sagrada-familia.jpeg
 *      (o que importa é o número no começo do nome)
 *   3. Rode:  npx tsx scripts/anexar-imagens.ts
 *
 * As imagens são redimensionadas (máx. 1400 px) e gravadas no card.
 */
import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()
const PASTA = path.resolve(process.cwd(), "imagens-santos")
const MAX_LARGURA = 1400
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

async function main() {
  if (!fs.existsSync(PASTA)) {
    fs.mkdirSync(PASTA, { recursive: true })
    console.log(`Pasta criada: ${PASTA}`)
    console.log("Coloque as imagens lá (001.jpg, 002.jpg, ...) e rode de novo.")
    return
  }

  const arquivos = fs
    .readdirSync(PASTA)
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))

  if (arquivos.length === 0) {
    console.log(`Nenhuma imagem em ${PASTA}. Coloque os arquivos e rode de novo.`)
    return
  }

  let ok = 0
  let semNumero = 0
  let semCard = 0

  for (const arquivo of arquivos.sort()) {
    const m = arquivo.match(/\d+/)
    if (!m) {
      console.log(`  ⚠ "${arquivo}" — não começa com número, pulando.`)
      semNumero++
      continue
    }
    const numero = parseInt(m[0], 10)

    const card = await db.cardSanto.findUnique({ where: { numero } })
    if (!card) {
      console.log(`  ⚠ "${arquivo}" — nenhum card com o nº ${numero}, pulando.`)
      semCard++
      continue
    }

    const buffer = await sharp(path.join(PASTA, arquivo))
      .rotate() // respeita a orientação EXIF
      .resize({ width: MAX_LARGURA, withoutEnlargement: true })
      .jpeg({ quality: 86 })
      .toBuffer()

    const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`
    await db.cardSanto.update({ where: { id: card.id }, data: { imagem: dataUrl } })

    const kb = Math.round(buffer.length / 1024)
    console.log(`  ✔ #${String(numero).padStart(3, "0")} ${card.nome}  ←  ${arquivo}  (${kb} KB)`)
    ok++
  }

  console.log(`\n✔ ${ok} imagem(ns) anexada(s).`)
  if (semNumero) console.log(`  ${semNumero} arquivo(s) sem número no nome.`)
  if (semCard) console.log(`  ${semCard} arquivo(s) sem card correspondente.`)

  const faltando = await db.cardSanto.findMany({
    where: { imagem: null },
    orderBy: { numero: "asc" },
    select: { numero: true, nome: true },
  })
  if (faltando.length) {
    console.log(`\nAinda sem imagem (${faltando.length}):`)
    for (const c of faltando) console.log(`  #${String(c.numero).padStart(3, "0")} ${c.nome}`)
  }
}

main().catch(console.error).finally(() => db.$disconnect())
