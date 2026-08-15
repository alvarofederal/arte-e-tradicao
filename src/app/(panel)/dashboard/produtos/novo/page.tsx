import type { Metadata } from "next"
import { ProdutoForm } from "../_components/produto-form"
import { opcoesFormulario } from "../_actions/produtos-actions"

export const metadata: Metadata = { title: "Novo produto" }
export const dynamic = "force-dynamic"

export default async function NovoProdutoPage() {
  const opcoes = await opcoesFormulario()
  return <ProdutoForm produto={null} opcoes={opcoes} />
}
