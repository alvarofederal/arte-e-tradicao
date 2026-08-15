"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2, Upload, Trash2, Sparkles } from "lucide-react"
import type { ProdutoRegistro, OpcoesForm } from "../_actions/produtos-actions"
import { salvarProduto } from "../_actions/produtos-actions"

function centavosParaReais(c: number): string {
  return (c / 100).toFixed(2).replace(".", ",")
}
function reaisParaCentavos(s: string): number {
  const limpo = s.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")
  const n = Math.round(parseFloat(limpo) * 100)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function ProdutoForm({ produto, opcoes }: { produto?: ProdutoRegistro | null; opcoes: OpcoesForm }) {
  const router = useRouter()
  const editando = !!produto

  const [sku, setSku] = useState(produto?.sku ?? "")
  const [nome, setNome] = useState(produto?.nome ?? "")
  const [descricao, setDescricao] = useState(produto?.descricao ?? "")
  const [preco, setPreco] = useState(produto ? centavosParaReais(produto.precoCentavos) : "")
  const [estoque, setEstoque] = useState(produto?.estoque ?? 0)
  const [santoId, setSantoId] = useState(produto?.santoId ?? "")
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId ?? "")
  const [imagem, setImagem] = useState<string | null>(produto?.imagem ?? null)
  const [ativo, setAtivo] = useState(produto?.ativo ?? true)
  const [salvando, setSalvando] = useState(false)

  function preencherNomePeloSanto(id: string) {
    setSantoId(id)
    if (!nome.trim()) {
      const s = opcoes.santos.find((x) => x.id === id)
      if (s) setNome(`Quebra-cabeça ${s.nome}`)
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Envie uma imagem."); return }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxW = 1000
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale)
        const canvas = document.createElement("canvas")
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0, w, h)
        setImagem(canvas.toDataURL("image/jpeg", 0.85))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  async function salvar() {
    if (!sku.trim()) { toast.error("Informe o SKU."); return }
    if (!nome.trim()) { toast.error("Informe o nome."); return }
    setSalvando(true)
    const res = await salvarProduto({
      id: produto?.id ?? null,
      sku, nome, descricao,
      precoCentavos: reaisParaCentavos(preco),
      estoque: Number(estoque) || 0,
      imagem, ativo,
      santoId: santoId || null,
      categoriaId: categoriaId || null,
    })
    setSalvando(false)
    if (!res.ok) { toast.error(res.error); return }
    toast.success(editando ? "Produto salvo!" : "Produto criado!")
    router.push("/dashboard/produtos")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard/produtos" className="dash-muted mb-3 inline-flex items-center gap-1.5 text-sm hover:opacity-80">
        <ArrowLeft size={15} /> Voltar aos produtos
      </Link>
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Sparkles size={14} /> Loja
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">{editando ? "Alterar produto" : "Novo produto"}</h1>
      </div>

      <div className="dash-card space-y-4 p-5">
        <label className="block">
          <span className="dash-muted mb-1 block text-xs font-medium">Santo</span>
          <select className="dash-input" value={santoId} onChange={(e) => preencherNomePeloSanto(e.target.value)}>
            <option value="">— sem Santo —</option>
            {opcoes.santos.map((s) => (
              <option key={s.id} value={s.id}>{s.numero != null ? `${String(s.numero).padStart(3, "0")} · ` : ""}{s.nome}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-[1fr_140px] gap-3">
          <label className="block">
            <span className="dash-muted mb-1 block text-xs font-medium">Nome do produto</span>
            <input className="dash-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Quebra-cabeça São Jorge" />
          </label>
          <label className="block">
            <span className="dash-muted mb-1 block text-xs font-medium">SKU</span>
            <input className="dash-input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="QC-SJORGE-40" style={{ fontFamily: "var(--font-geist-mono), monospace" }} />
          </label>
        </div>

        <label className="block">
          <span className="dash-muted mb-1 block text-xs font-medium">Descrição</span>
          <textarea className="dash-input" rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ resize: "vertical" }} placeholder="Detalhes do produto, nº de peças, material..." />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="dash-muted mb-1 block text-xs font-medium">Preço (R$)</span>
            <input className="dash-input" inputMode="decimal" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="89,90" />
          </label>
          <label className="block">
            <span className="dash-muted mb-1 block text-xs font-medium">Estoque</span>
            <input className="dash-input" type="number" min={0} value={estoque} onChange={(e) => setEstoque(Number(e.target.value) || 0)} />
          </label>
        </div>

        <label className="block">
          <span className="dash-muted mb-1 block text-xs font-medium">Categoria</span>
          <select className="dash-input" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">— sem categoria —</option>
            {opcoes.categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {opcoes.categorias.length === 0 && (
            <span className="dash-muted mt-1 block text-xs">Nenhuma categoria ainda — crie em <Link href="/dashboard/categorias" className="underline">Categorias</Link>.</span>
          )}
        </label>

        <div>
          <span className="dash-muted mb-1 block text-xs font-medium">Foto do produto</span>
          <div className="flex items-center gap-3">
            <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,0,0,0.12)", background: "#F5ECD6", display: "grid", placeItems: "center" }}>
              {imagem
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={imagem} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Upload size={18} style={{ color: "#A67C2E" }} />}
            </div>
            <label className="dash-btn-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm">
              <Upload size={15} /> {imagem ? "Trocar" : "Enviar"}
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
            {imagem && (
              <button onClick={() => setImagem(null)} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm" style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)" }}>
                <Trash2 size={15} /> Remover
              </button>
            )}
          </div>
          <p className="dash-muted mt-1 text-xs">Se ficar vazio, a loja usa a imagem do Santo.</p>
        </div>

        <button type="button" onClick={() => setAtivo((v) => !v)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: ativo ? "rgba(201,162,75,0.12)" : "rgba(0,0,0,0.04)" }}>
          <span className="dash-subtitle">Ativo na loja</span>
          <span style={{ width: 38, height: 22, borderRadius: 999, background: ativo ? "#C9A24B" : "rgba(0,0,0,0.2)", position: "relative", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 2, left: ativo ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
          </span>
        </button>

        <button disabled={salvando} onClick={salvar} className="dash-btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60">
          {salvando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editando ? "Salvar alterações" : "Criar produto"}
        </button>
      </div>
    </div>
  )
}
