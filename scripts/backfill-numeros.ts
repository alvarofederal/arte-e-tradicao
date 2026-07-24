// Atribui números globais sequenciais aos cards que ainda não têm.
// Ordem de criação = ordem da numeração. Rode uma vez: npx tsx scripts/backfill-numeros.ts
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()

async function main() {
  const semNumero = await db.cardSanto.findMany({
    where: { numero: null },
    orderBy: { criadoEm: "asc" },
    select: { id: true, nome: true },
  })
  if (semNumero.length === 0) {
    console.log("Nada a numerar.")
    return
  }

  const maior = await db.cardSanto.aggregate({ _max: { numero: true } })
  let proximo = (maior._max.numero ?? 0) + 1

  for (const c of semNumero) {
    await db.cardSanto.update({ where: { id: c.id }, data: { numero: proximo } })
    console.log(`  #${String(proximo).padStart(3, "0")} → ${c.nome}`)
    proximo++
  }
  console.log(`✔ ${semNumero.length} card(s) numerado(s).`)
}

main().catch(console.error).finally(() => db.$disconnect())
