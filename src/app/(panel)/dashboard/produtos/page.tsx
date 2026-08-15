import type { Metadata } from "next"
import { ProdutosList } from "./_components/produtos-list"
import { listarProdutos } from "./_actions/produtos-actions"

export const metadata: Metadata = { title: "Produtos" }
export const dynamic = "force-dynamic"

export default async function ProdutosPage() {
  const produtos = await listarProdutos()
  return <ProdutosList initial={produtos} />
}
