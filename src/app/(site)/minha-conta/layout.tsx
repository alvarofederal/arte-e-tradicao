import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ContaNav } from "./_components/conta-nav"

export default async function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/minha-conta")

  const nome = session.user.name || session.user.email?.split("@")[0] || "devoto(a)"
  const ehStaff = session.user.role === "SUPER_ADMIN" || session.user.role === "LOJISTA"

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="arte-eyebrow">Minha conta</span>
          <h1 className="mt-1 text-3xl sm:text-4xl">Olá, {nome}</h1>
        </div>
        {ehStaff && (
          <Link href="/dashboard" className="arte-btn arte-btn-ghost arte-btn-sm">Ir ao painel</Link>
        )}
      </header>

      <ContaNav />

      <div className="mt-8">{children}</div>
    </div>
  )
}
