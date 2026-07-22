// src/app/(panel)/dashboard/cards/page.tsx
// Listagem dos cards dos Santos. A criação/alteração é em telas próprias
// (/dashboard/cards/novo e /dashboard/cards/[id]). Implementa a spec 007.
import type { Metadata } from "next"
import { CardsList } from "./_components/cards-list"
import { listarCards } from "./_actions/cards-actions"

export const metadata: Metadata = {
  title: "Cards dos Santos",
}

export const dynamic = "force-dynamic"

export default async function CardsPage() {
  const cards = await listarCards()
  return <CardsList initialCards={cards} />
}
