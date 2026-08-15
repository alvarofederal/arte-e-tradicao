import type { Metadata } from "next"
import { Users } from "lucide-react"
import { listarUsuarios } from "./_actions/usuarios-actions"
import { UsuariosList } from "./_components/usuarios-list"

export const metadata: Metadata = { title: "Usuários" }
export const dynamic = "force-dynamic"

export default async function UsuariosPage() {
  const usuarios = await listarUsuarios()
  const clientes = usuarios.filter((u) => u.role === "CLIENTE").length
  const equipe = usuarios.length - clientes

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
          <Users size={14} /> Administração
        </div>
        <h1 className="dash-title mt-1 text-2xl font-bold">Usuários</h1>
        <p className="dash-subtitle text-sm">
          {usuarios.length} usuário(s) · {clientes} cliente(s) · {equipe} da equipe.
        </p>
      </div>

      <UsuariosList initial={usuarios} />
    </div>
  )
}
