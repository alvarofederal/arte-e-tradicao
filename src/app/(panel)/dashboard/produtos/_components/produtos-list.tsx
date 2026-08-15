"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Package, Plus, Pencil, Trash2, Sparkles } from "lucide-react"
import type { ProdutoRegistro } from "../_actions/produtos-actions"
import { excluirProduto } from "../_actions/produtos-actions"

function reais(c: number): string {
  return "R$ " + (c / 100).toFixed(2).replace(".", ",")
}

export function ProdutosList({ initial }: { initial: ProdutoRegistro[] }) {
  const router = useRouter()
  const [excluindo, setExcluindo] = useState<string | null>(null)

  async function excluir(p: ProdutoRegistro) {
    if (!confirm(`Excluir o produto "${p.nome}"?`)) return
    setExcluindo(p.id)
    const res = await excluirProduto(p.id)
    setExcluindo(null)
    if (!res.ok) { toast.error("Não foi possível excluir."); return }
    toast.success("Produto excluído.")
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
            <Sparkles size={14} /> Loja
          </div>
          <h1 className="dash-title mt-1 text-2xl font-bold">Produtos</h1>
          <p className="dash-subtitle text-sm">
            {initial.length === 0 ? "Nenhum produto ainda." : `${initial.length} produto${initial.length > 1 ? "s" : ""} no catálogo.`}
          </p>
        </div>
        <Link href="/dashboard/produtos/novo" className="dash-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      {initial.length === 0 ? (
        <div className="dash-card flex flex-col items-center gap-3 p-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "rgba(201,162,75,0.14)", color: "#A67C2E" }}>
            <Package size={26} />
          </span>
          <h3 className="dash-title text-lg font-semibold">Cadastre o primeiro produto</h3>
          <p className="dash-subtitle max-w-sm text-sm">Ligue cada quebra-cabeça a um Santo, defina SKU, preço e estoque.</p>
          <Link href="/dashboard/produtos/novo" className="dash-btn-primary mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
            <Plus size={16} /> Novo produto
          </Link>
        </div>
      ) : (
        <div className="dash-card overflow-hidden">
          <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            {initial.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
                  {p.imagem
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.imagem} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Package size={18} style={{ color: "#A67C2E", opacity: 0.6 }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="dash-title truncate text-sm font-semibold">{p.nome}</p>
                  <p className="dash-muted truncate text-xs">
                    <span style={{ fontFamily: "var(--font-geist-mono), monospace" }}>{p.sku}</span>
                    {p.categoriaNome && <> · {p.categoriaNome}</>}
                    {p.santoNome && <> · {p.santoNome}</>}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="dash-title text-sm font-bold" style={{ color: "#A67C2E" }}>{reais(p.precoCentavos)}</p>
                  <p className="dash-muted text-xs">{p.estoque} em estoque</p>
                </div>
                {!p.ativo && <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(0,0,0,0.06)", color: "#888" }}>inativo</span>}
                <Link href={`/dashboard/produtos/${p.id}`} className="rounded-lg p-2 hover:opacity-70" style={{ color: "#A67C2E" }} title="Editar"><Pencil size={15} /></Link>
                <button onClick={() => excluir(p)} disabled={excluindo === p.id} className="rounded-lg p-2 hover:opacity-70 disabled:opacity-40" style={{ color: "#dc2626" }} title="Excluir"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
