"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { User } from "lucide-react"

// Alterna "Entrar" / "Minha conta" no cliente, sem tornar o site dinâmico.
export function AccountLink() {
  const { status } = useSession()
  const logado = status === "authenticated"

  return logado ? (
    <Link href="/minha-conta" className="arte-navlink hidden items-center gap-1.5 text-sm sm:inline-flex">
      <User size={16} /> Minha conta
    </Link>
  ) : (
    <Link href="/login" className="arte-navlink hidden text-sm sm:inline">
      Entrar
    </Link>
  )
}
