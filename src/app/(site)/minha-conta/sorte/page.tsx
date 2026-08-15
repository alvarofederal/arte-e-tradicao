import { redirect } from "next/navigation"
import { Clock, Ticket } from "lucide-react"
import { auth } from "@/lib/auth"
import { listarMeusVouchers, VALIDADE_VOUCHER_DIAS } from "@/lib/codigo-sorte"
import { ResgatarForm } from "./_components/resgatar-form"

export const dynamic = "force-dynamic"

function dataBR(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d)
}

export default async function SortePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/minha-conta/sorte")

  const vouchers = await listarMeusVouchers(session.user.id)
  const disponiveis = vouchers.filter((v) => v.disponivel)
  const usadosOuExpirados = vouchers.filter((v) => !v.disponivel)

  return (
    <div className="space-y-8">
      {/* Resgate */}
      <div className="arte-card overflow-hidden">
        <div className="p-6" style={{ background: "linear-gradient(160deg, rgba(228,203,144,0.35), rgba(169,193,217,0.18))" }}>
          <span className="arte-eyebrow"><Ticket size={14} /> Código da Sorte</span>
          <h2 className="mt-1 text-2xl sm:text-3xl">Tem um código na sua caixa?</h2>
          <p className="mt-2 max-w-xl" style={{ color: "var(--arte-ink-soft)" }}>
            Cada quebra-cabeça traz um código impresso na embalagem. Digite abaixo e ganhe um
            voucher de desconto para levar <strong>outro</strong> Santo da coleção.
          </p>
        </div>
        <div className="p-6">
          <ResgatarForm />
        </div>
      </div>

      {/* Vouchers disponíveis */}
      <section>
        <h3 className="text-xl">Meus vouchers</h3>
        {disponiveis.length === 0 ? (
          <p className="mt-3 text-sm" style={{ color: "var(--arte-ink-soft)" }}>
            Você ainda não tem vouchers ativos. Os vouchers valem por {VALIDADE_VOUCHER_DIAS} dias.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {disponiveis.map((v) => {
              const gratis = v.descontoPercent >= 100
              return (
                <div key={v.id} className="arte-card overflow-hidden p-0">
                  <div className="flex items-center justify-between px-5 py-4" style={{ background: "linear-gradient(120deg, rgba(150,190,160,0.35), rgba(228,203,144,0.25))" }}>
                    <span className="text-3xl font-bold" style={{ color: "#3B6B4A" }}>{gratis ? "Grátis" : `${v.descontoPercent}%`}</span>
                    <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold tracking-wider" style={{ color: "var(--arte-ink)" }}>{v.codigo}</span>
                  </div>
                  <div className="px-5 py-4 text-sm">
                    <p>
                      {gratis ? "Um quebra-cabeça grátis" : "Desconto"} em qualquer Santo, <strong>exceto {v.santoExcluidoNome}</strong>.
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5" style={{ color: "var(--arte-ink-soft)" }}>
                      <Clock size={14} /> Válido até {dataBR(v.expiraEm)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Histórico */}
      {usadosOuExpirados.length > 0 && (
        <section>
          <h3 className="text-lg" style={{ color: "var(--arte-ink-soft)" }}>Vouchers usados ou expirados</h3>
          <ul className="mt-3 space-y-2">
            {usadosOuExpirados.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm" style={{ borderColor: "var(--arte-line)", opacity: 0.7 }}>
                <span className="font-semibold">{v.descontoPercent >= 100 ? "Grátis" : `${v.descontoPercent}%`} · {v.codigo}</span>
                <span style={{ color: "var(--arte-ink-soft)" }}>{v.usado ? "Utilizado" : "Expirado"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
