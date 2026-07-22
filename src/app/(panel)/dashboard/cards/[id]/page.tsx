// Tela de alteração de um card existente.
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CardStudio } from "../_components/card-studio"
import { obterCard } from "../_actions/cards-actions"

export const metadata: Metadata = {
  title: "Alterar card",
}

export const dynamic = "force-dynamic"

export default async function AlterarCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await obterCard(id)
  if (!card) notFound()
  return <CardStudio card={card} />
}
