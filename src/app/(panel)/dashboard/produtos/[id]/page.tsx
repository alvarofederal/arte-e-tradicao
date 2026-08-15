import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProdutoForm } from "../_components/produto-form"
import { obterProduto, opcoesFormulario } from "../_actions/produtos-actions"

export const metadata: Metadata = { title: "Alterar produto" }
export const dynamic = "force-dynamic"

export default async function AlterarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [produto, opcoes] = await Promise.all([obterProduto(id), opcoesFormulario()])
  if (!produto) notFound()
  return <ProdutoForm produto={produto} opcoes={opcoes} />
}
