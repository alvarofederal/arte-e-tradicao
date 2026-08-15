"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clover, Package, User } from "lucide-react"

const abas = [
  { href: "/minha-conta", label: "Visão geral", icon: User, exact: true },
  { href: "/minha-conta/pedidos", label: "Meus pedidos", icon: Package },
  { href: "/minha-conta/sorte", label: "Tente a sorte", icon: Clover },
]

export function ContaNav() {
  const pathname = usePathname()
  return (
    <nav className="mt-6 flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: "var(--arte-line)" }}>
      {abas.map((a) => {
        const ativo = a.exact ? pathname === a.href : pathname.startsWith(a.href)
        const Icon = a.icon
        return (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors"
            style={
              ativo
                ? { background: "var(--arte-gold-deep)", color: "#fff" }
                : { color: "var(--arte-ink-soft)" }
            }
          >
            <Icon size={15} /> {a.label}
          </Link>
        )
      })}
    </nav>
  )
}
