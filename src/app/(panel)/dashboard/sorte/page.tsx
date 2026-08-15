import type { Metadata } from "next"
import { Clover } from "lucide-react"
import { db } from "@/lib/prisma"
import { listarLotesAdmin } from "@/lib/codigo-sorte"
import { GerarLoteForm } from "./_components/gerar-lote-form"
import { LotesList } from "./_components/lotes-list"

export const metadata: Metadata = { title: "Código da Sorte" }
export const dynamic = "force-dynamic"

export default async function SorteAdminPage() {
  const [santos, lotes] = await Promise.all([
    db.santo.findMany({ where: { ativo: true }, orderBy: { numero: "asc" }, select: { id: true, nome: true, numero: true } }),
    listarLotesAdmin(),
  ])

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Clover size={14} /> Marketing
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">Código da Sorte</h1>
        <p className="dash-subtitle text-sm">
          Gere os códigos que vão impressos nas embalagens. Cada código dá um voucher de desconto
          para outro Santo da coleção.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
        <GerarLoteForm santos={santos} />
        <LotesList lotes={lotes} />
      </div>
    </div>
  )
}
