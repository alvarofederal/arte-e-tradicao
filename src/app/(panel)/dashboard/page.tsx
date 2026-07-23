import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/prisma"
import Link from "next/link"
import { Palette, ArrowRight, Plus, Album, ShoppingBag, Brain, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const nome = session.user.name?.split(" ")[0] ?? "bem-vindo"
  const totalCards = await db.cardSanto.count()

  const atalhos = [
    {
      titulo: "Cards dos Santos",
      desc: totalCards > 0 ? `${totalCards} card${totalCards > 1 ? "s" : ""} cadastrado${totalCards > 1 ? "s" : ""}` : "Crie a primeira figurinha",
      href: "/dashboard/cards",
      icon: Palette,
      cls: "dash-icon-emerald",
      ativo: true,
    },
    { titulo: "Coleções & Álbum", desc: "Em breve", href: null, icon: Album, cls: "dash-icon-purple", ativo: false },
    { titulo: "Loja & Produtos", desc: "Em breve", href: null, icon: ShoppingBag, cls: "dash-icon-orange", ativo: false },
    { titulo: "Jogo da Memória", desc: "Em breve", href: null, icon: Brain, cls: "dash-icon-blue", ativo: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#A67C2E" }}>
            <Sparkles size={14} /> Arte &amp; Tradição
          </div>
          <h1 className="dash-title mt-1 text-xl font-bold sm:text-2xl">Olá, {nome} 👋</h1>
          <p className="dash-subtitle mt-0.5 text-sm">Painel administrativo da plataforma.</p>
        </div>
        <Link href="/dashboard/cards/novo" className="dash-btn-primary inline-flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Novo card</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {atalhos.map((a) => {
          const inner = (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.cls}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                {a.ativo && <ArrowRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-emerald-500 dark:text-white/20" />}
              </div>
              <p className="dash-title text-base font-semibold">{a.titulo}</p>
              <p className="dash-subtitle mt-0.5 text-sm">{a.desc}</p>
            </>
          )
          return a.href ? (
            <Link key={a.titulo} href={a.href} className="dash-card-hover group p-5">{inner}</Link>
          ) : (
            <div key={a.titulo} className="dash-card p-5 opacity-60">{inner}</div>
          )
        })}
      </div>

      <div className="dash-card border-dashed p-10 text-center">
        <div className="dash-icon-emerald mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
          <Palette className="h-6 w-6" />
        </div>
        <h2 className="dash-title mb-2 text-lg font-semibold">Estúdio de Cards dos Santos</h2>
        <p className="dash-subtitle mx-auto mb-6 max-w-md text-sm">
          Monte as figurinhas dos Santos controlando imagem e cores, e imprima em folha A4. As próximas frentes
          (coleções, álbum, loja) entram em seguida.
        </p>
        <Link href="/dashboard/cards" className="dash-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm">
          <Palette className="h-4 w-4" /> Abrir os cards
        </Link>
      </div>
    </div>
  )
}
