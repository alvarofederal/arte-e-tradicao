"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { LogOut, Menu, ChevronDown, Cross } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopNavbarProps {
  userName: string | null
  userEmail: string | null
  role: string
  onMenuClick: () => void
}

export function TopNavbar({ userName, userEmail, role, onMenuClick }: TopNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const isAdmin = role === "SUPER_ADMIN"
  const initial = (userName ?? userEmail ?? "?")[0].toUpperCase()
  const displayName = userName ?? userEmail ?? "Usuário"

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header className="dash-header z-30 flex h-14 flex-shrink-0 items-center gap-3 px-4">
      {/* Hamburger (mobile) */}
      <button onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        aria-label="Abrir menu">
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo mobile */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "rgba(201,162,75,0.16)", color: "#A67C2E" }}>
          <Cross size={15} strokeWidth={2.2} />
        </span>
        <span className="font-bold tracking-tight text-gray-900 dark:text-white" style={{ fontSize: 15 }}>
          Arte&nbsp;&amp;&nbsp;Tradição
        </span>
      </Link>

      <div className="flex-1" />

      <ThemeToggle />

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label="Perfil">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(201,162,75,0.16)", border: "1px solid rgba(201,162,75,0.30)" }}>
            <span className="text-xs font-bold" style={{ color: "#A67C2E" }}>{initial}</span>
          </div>
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block dark:text-white/80">
            {displayName}
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block dark:text-white/35" />
        </button>

        {profileOpen && (
          <div className="dash-dropdown absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-4 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(201,162,75,0.16)", border: "1px solid rgba(201,162,75,0.30)" }}>
                  <span className="text-sm font-bold" style={{ color: "#A67C2E" }}>{initial}</span>
                </div>
                <div className="min-w-0">
                  <p className="dash-title truncate text-sm font-semibold">{displayName}</p>
                  {userEmail && <p className="dash-muted truncate text-xs">{userEmail}</p>}
                  <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: "rgba(201,162,75,0.15)", color: "#A67C2E" }}>
                    {isAdmin ? "Administrador" : "Usuário"}
                  </span>
                </div>
              </div>
            </div>
            <div className="py-1.5">
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
