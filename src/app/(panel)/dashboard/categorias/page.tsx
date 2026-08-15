import type { Metadata } from "next"
import { CategoriasManager } from "./_components/categorias-manager"
import { listarCategorias } from "./_actions/categorias-actions"

export const metadata: Metadata = { title: "Categorias" }
export const dynamic = "force-dynamic"

export default async function CategoriasPage() {
  const categorias = await listarCategorias()
  return <CategoriasManager initial={categorias} />
}
