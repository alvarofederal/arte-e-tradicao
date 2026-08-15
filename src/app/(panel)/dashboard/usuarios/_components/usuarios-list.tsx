"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BadgeCheck, KeyRound, Mail, MailCheck, Power, ShieldCheck } from "lucide-react"
import type { UsuarioRegistro } from "../_actions/usuarios-actions"
import { alterarRole, alternarAtivo, verificarEmail } from "../_actions/usuarios-actions"

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Administrador",
  LOJISTA: "Equipe (lojista)",
  CLIENTE: "Cliente",
}
const ROLE_COR: Record<string, { bg: string; fg: string }> = {
  SUPER_ADMIN: { bg: "rgba(201,162,75,0.22)", fg: "#8A6D1E" },
  LOJISTA: { bg: "rgba(169,193,217,0.28)", fg: "#3C5B7A" },
  CLIENTE: { bg: "rgba(150,190,160,0.26)", fg: "#3B6B4A" },
}

function dataBR(d: Date | null) {
  if (!d) return "—"
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d))
}

export function UsuariosList({ initial }: { initial: UsuarioRegistro[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<string>("TODOS")

  const lista = filtro === "TODOS" ? initial : initial.filter((u) => u.role === filtro)

  async function mudarRole(u: UsuarioRegistro, role: string) {
    setBusy(u.id)
    const res = await alterarRole(u.id, role)
    setBusy(null)
    if (res.ok) { toast.success("Nível atualizado."); router.refresh() }
    else toast.error(res.error ?? "Falhou.")
  }

  async function toggleAtivo(u: UsuarioRegistro) {
    setBusy(u.id)
    const res = await alternarAtivo(u.id)
    setBusy(null)
    if (res.ok) { toast.success(u.ativo ? "Usuário desativado." : "Usuário ativado."); router.refresh() }
    else toast.error(res.error ?? "Falhou.")
  }

  async function verificar(u: UsuarioRegistro) {
    setBusy(u.id)
    const res = await verificarEmail(u.id)
    setBusy(null)
    if (res.ok) { toast.success("E-mail verificado."); router.refresh() }
    else toast.error(res.error ?? "Falhou.")
  }

  return (
    <div>
      {/* Filtro por nível */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["TODOS", "CLIENTE", "LOJISTA", "SUPER_ADMIN"].map((r) => (
          <button
            key={r}
            onClick={() => setFiltro(r)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
            style={filtro === r ? { background: "#A67C2E", color: "#fff" } : { background: "rgba(0,0,0,0.05)", color: "#666" }}
          >
            {r === "TODOS" ? "Todos" : ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      <div className="dash-card overflow-hidden">
        <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          {lista.map((u) => {
            const cor = ROLE_COR[u.role]
            return (
              <div key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-sm font-bold" style={{ background: cor.bg, color: cor.fg }}>
                  {(u.nome ?? u.email)[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="dash-title truncate text-sm font-semibold">
                    {u.nome ?? u.email.split("@")[0]}
                    {!u.ativo && <span className="ml-2 rounded-full px-2 py-0.5 text-[11px]" style={{ background: "rgba(0,0,0,0.06)", color: "#999" }}>inativo</span>}
                  </p>
                  <p className="dash-muted flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                    <span className="inline-flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                    {u.verificado && <span className="inline-flex items-center gap-1" style={{ color: "#3B6B4A" }}><BadgeCheck size={11} /> verificado</span>}
                    {u.temSenha && <span className="inline-flex items-center gap-1"><KeyRound size={11} /> senha</span>}
                    {u.temGoogle && <span className="inline-flex items-center gap-1"><ShieldCheck size={11} /> Google</span>}
                  </p>
                  <p className="dash-muted text-xs">
                    {u.totalPedidos} pedido(s) · cadastro {dataBR(u.criadoEm)} · último acesso {dataBR(u.ultimoAcesso)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => mudarRole(u, e.target.value)}
                    disabled={busy === u.id}
                    className="rounded-lg border px-2 py-1.5 text-xs font-semibold"
                    style={{ borderColor: "rgba(0,0,0,0.14)", background: "#fff", color: "#1a1a1a" }}
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="LOJISTA">Equipe (lojista)</option>
                    <option value="SUPER_ADMIN">Administrador</option>
                  </select>
                  {!u.verificado && (
                    <button
                      onClick={() => verificar(u)}
                      disabled={busy === u.id}
                      className="rounded-lg p-2 hover:opacity-70 disabled:opacity-40"
                      style={{ color: "#3B6B4A" }}
                      title="Verificar e-mail manualmente"
                    >
                      <MailCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => toggleAtivo(u)}
                    disabled={busy === u.id}
                    className="rounded-lg p-2 hover:opacity-70 disabled:opacity-40"
                    style={{ color: u.ativo ? "#dc2626" : "#3B6B4A" }}
                    title={u.ativo ? "Desativar" : "Ativar"}
                  >
                    <Power size={16} />
                  </button>
                </div>
              </div>
            )
          })}
          {lista.length === 0 && (
            <p className="dash-muted px-4 py-10 text-center text-sm">Nenhum usuário neste filtro.</p>
          )}
        </div>
      </div>
    </div>
  )
}
