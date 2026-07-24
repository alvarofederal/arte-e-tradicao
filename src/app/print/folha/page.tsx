// Folha A4 de impressão (gabarito 4 × 3 = 12 cards de 49 × 65 mm).
// ?ids=a,b,c  &modo=colecionavel|memoria
import type { Metadata } from "next"
import { obterCardsPorIds } from "@/app/(panel)/dashboard/cards/_actions/cards-actions"
import { PrintFolhaView, type ModoFolha } from "./print-folha-view"

export const metadata: Metadata = { title: "Folha de impressão" }
export const dynamic = "force-dynamic"

export default async function FolhaPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string; modo?: string }>
}) {
  const { ids = "", modo } = await searchParams
  const lista = ids.split(",").map((s) => s.trim()).filter(Boolean)
  const cards = await obterCardsPorIds(lista)
  const modoFolha: ModoFolha = modo === "memoria" ? "memoria" : "colecionavel"

  return <PrintFolhaView cards={cards} modo={modoFolha} />
}
