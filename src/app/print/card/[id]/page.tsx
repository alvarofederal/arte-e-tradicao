// Prévia de impressão (A4) de um card — frente + verso lado a lado.
// Fora do grupo (panel): sem a moldura do dashboard, ideal para imprimir.
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { obterCard } from "@/app/(panel)/dashboard/cards/_actions/cards-actions"
import { PrintView } from "./print-view"

export const metadata: Metadata = {
  title: "Prévia de impressão",
}

export const dynamic = "force-dynamic"

export default async function PrintCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await obterCard(id)
  if (!card) notFound()
  return <PrintView card={card} />
}
