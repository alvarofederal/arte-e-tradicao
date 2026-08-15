/**
 * Migra o catálogo de Santos do CardSanto (estúdio de cards) para a entidade
 * Santo (páginas do site + produtos). Idempotente: faz upsert por número.
 * Rode com: npx tsx scripts/migrar-santos.ts
 */
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function main() {
  const cards = await db.cardSanto.findMany({ orderBy: { numero: "asc" } })
  if (cards.length === 0) {
    console.log("Nenhum CardSanto para migrar.")
    return
  }

  const usados = new Set<string>()
  let ok = 0

  for (const c of cards) {
    if (c.numero == null) continue

    // slug único
    let slug = slugify(c.nome) || `santo-${c.numero}`
    let base = slug
    let i = 2
    while (usados.has(slug)) slug = `${base}-${i++}`
    usados.add(slug)

    const estilo = (c.estilo ?? {}) as Record<string, unknown>
    const bordaCor = typeof estilo.bordaCor === "string" ? estilo.bordaCor : "#C9A24B"

    await db.santo.upsert({
      where: { numero: c.numero },
      update: {
        nome: c.nome,
        slug,
        dataFesta: c.dataFesta,
        historia: c.descricao,
        imagem: c.imagem,
        bordaCor,
      },
      create: {
        numero: c.numero,
        nome: c.nome,
        slug,
        dataFesta: c.dataFesta,
        historia: c.descricao,
        imagem: c.imagem,
        bordaCor,
      },
    })
    ok++
  }

  const total = await db.santo.count()
  console.log(`✔ ${ok} Santos migrados. Entidade Santo agora tem ${total} registros.`)
}

main().catch(console.error).finally(() => db.$disconnect())
