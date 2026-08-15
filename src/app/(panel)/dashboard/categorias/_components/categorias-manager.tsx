"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Tags, Plus, Pencil, Trash2, Check, X, Loader2, Sparkles } from "lucide-react"
import type { CategoriaRegistro } from "../_actions/categorias-actions"
import { salvarCategoria, excluirCategoria } from "../_actions/categorias-actions"

export function CategoriasManager({ initial }: { initial: CategoriaRegistro[] }) {
  const router = useRouter()
  const [editId, setEditId] = useState<string | null>(null)
  const [nome, setNome] = useState("")
  const [ordem, setOrdem] = useState(0)
  const [ativo, setAtivo] = useState(true)
  const [salvando, setSalvando] = useState(false)

  function novo() { setEditId(null); setNome(""); setOrdem(0); setAtivo(true) }
  function editar(c: CategoriaRegistro) { setEditId(c.id); setNome(c.nome); setOrdem(c.ordem); setAtivo(c.ativo) }

  async function salvar() {
    if (!nome.trim()) { toast.error("Informe o nome da categoria."); return }
    setSalvando(true)
    const res = await salvarCategoria({ id: editId, nome, ordem, ativo })
    setSalvando(false)
    if (!res.ok) { toast.error(res.error); return }
    toast.success(editId ? "Categoria salva!" : "Categoria criada!")
    novo()
    router.refresh()
  }

  async function excluir(c: CategoriaRegistro) {
    if (!confirm(`Excluir a categoria "${c.nome}"?`)) return
    const res = await excluirCategoria(c.id)
    if (!res.ok) { toast.error(res.error ?? "Não foi possível excluir."); return }
    toast.success("Categoria excluída.")
    if (editId === c.id) novo()
    router.refresh()
  }

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Sparkles size={14} /> Loja
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">Categorias</h1>
        <p className="dash-subtitle text-sm">Organize os produtos em categorias para a loja.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Formulário */}
        <div className="dash-card h-fit p-5">
          <h3 className="dash-label mb-3">{editId ? "Editar categoria" : "Nova categoria"}</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="dash-muted mb-1 block text-xs font-medium">Nome</span>
              <input className="dash-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Quebra-cabeças" />
            </label>
            <label className="block">
              <span className="dash-muted mb-1 block text-xs font-medium">Ordem</span>
              <input className="dash-input" type="number" min={0} value={ordem} onChange={(e) => setOrdem(Number(e.target.value) || 0)} />
            </label>
            <button type="button" onClick={() => setAtivo((v) => !v)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: ativo ? "rgba(201,162,75,0.12)" : "rgba(0,0,0,0.04)" }}>
              <span className="dash-subtitle">Ativa na loja</span>
              <span style={{ width: 38, height: 22, borderRadius: 999, background: ativo ? "#C9A24B" : "rgba(0,0,0,0.2)", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", top: 2, left: ativo ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
              </span>
            </button>
            <div className="flex gap-2 pt-1">
              <button disabled={salvando} onClick={salvar} className="dash-btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
                {salvando ? <Loader2 size={15} className="animate-spin" /> : editId ? <Check size={15} /> : <Plus size={15} />}
                {editId ? "Salvar" : "Adicionar"}
              </button>
              {editId && (
                <button onClick={novo} className="dash-muted inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm hover:opacity-80">
                  <X size={15} /> Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="dash-card overflow-hidden">
          {initial.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <Tags size={26} style={{ color: "#A67C2E" }} />
              <p className="dash-subtitle text-sm">Nenhuma categoria ainda. Crie a primeira ao lado.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {initial.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="dash-title truncate text-sm font-semibold">{c.nome}</p>
                    <p className="dash-muted text-xs">{c.qtdProdutos} produto{c.qtdProdutos !== 1 ? "s" : ""} · ordem {c.ordem}</p>
                  </div>
                  {!c.ativo && <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(0,0,0,0.06)", color: "#888" }}>inativa</span>}
                  <button onClick={() => editar(c)} className="rounded-lg p-2 hover:opacity-70" style={{ color: "#A67C2E" }} title="Editar"><Pencil size={15} /></button>
                  <button onClick={() => excluir(c)} className="rounded-lg p-2 hover:opacity-70" style={{ color: "#dc2626" }} title="Excluir"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
