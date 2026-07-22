// Tela de cadastro de card (editor em branco).
import type { Metadata } from "next"
import { CardStudio } from "../_components/card-studio"

export const metadata: Metadata = {
  title: "Novo card",
}

export default function NovoCardPage() {
  return <CardStudio card={null} />
}
