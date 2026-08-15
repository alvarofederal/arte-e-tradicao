import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { listarMeusVouchersDisponiveis } from "@/lib/codigo-sorte"
import { CheckoutForm } from "./_components/checkout-form"

export const metadata: Metadata = { title: "Finalizar compra" }
export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login?callbackUrl=/loja/checkout")

  const vouchers = await listarMeusVouchersDisponiveis(session.user.id)

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/loja/carrinho" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Voltar ao carrinho
      </Link>

      <h1 className="mt-6 text-3xl sm:text-4xl">Finalizar compra</h1>
      <p className="mt-2" style={{ color: "var(--arte-ink-soft)" }}>
        Confira seus itens, informe os dados de entrega e gere o PIX para pagamento.
      </p>

      <CheckoutForm
        defaultNome={session.user.name ?? ""}
        email={session.user.email ?? ""}
        vouchers={vouchers.map((v) => ({
          codigo: v.codigo,
          descontoPercent: v.descontoPercent,
          santoExcluidoNome: v.santoExcluidoNome,
        }))}
      />
    </div>
  )
}
