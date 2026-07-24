// Jogo da Memória — seleciona os Santos e gera as folhas (pares + verso padrão).
import type { Metadata } from "next"
import { MemoriaBuilder } from "./_components/memoria-builder"
import { listarCards } from "../cards/_actions/cards-actions"

export const metadata: Metadata = { title: "Jogo da Memória" }
export const dynamic = "force-dynamic"

export default async function MemoriaPage() {
  const cards = await listarCards()
  return <MemoriaBuilder cards={cards} />
}
