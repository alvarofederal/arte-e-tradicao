import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight, Clover, Gift, Package, Percent, ScanLine, Sparkles, Ticket, UserPlus, Church,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Como funciona a premiação",
  description:
    "O Código da Sorte da Arte & Tradição: cada quebra-cabeça traz um código premiado. Cadastre-se, tente a sorte e ganhe descontos — ou um quebra-cabeça grátis.",
}

const passos = [
  { icon: Package, t: "Compre um quebra-cabeça", d: "Cada caixa traz um código único impresso na embalagem, no formato XXXX-XXXX-XXXX-XXXX." },
  { icon: UserPlus, t: "Crie sua conta", d: "Rápido e gratuito. É onde ficam seus pedidos e seus prêmios, com segurança." },
  { icon: ScanLine, t: "Digite o código em “Tente a sorte”", d: "No seu perfil. Comprou 5 caixas? São 5 tentativas — cada código vale uma vez." },
  { icon: Gift, t: "Descubra seu prêmio na hora", d: "O prêmio vira um voucher na sua conta, pronto para usar na próxima compra." },
]

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      {/* Hero */}
      <div className="text-center">
        <span className="arte-eyebrow"><Clover size={14} /> Código da Sorte</span>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">Cada caixa pode premiar você</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Todo quebra-cabeça da Arte&nbsp;&amp;&nbsp;Tradição vem com um código premiado. É a nossa forma
          de agradecer e de convidar você a completar a coleção dos Santos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/loja" className="arte-btn arte-btn-primary">Ver a loja <ArrowRight size={16} /></Link>
          <Link href="/minha-conta/sorte" className="arte-btn arte-btn-ghost">Tentar a sorte <Sparkles size={16} /></Link>
        </div>
      </div>

      {/* Passos */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {passos.map((p, i) => {
          const Icon = p.icon
          return (
            <div key={p.t} className="arte-card p-6">
              <div className="flex items-center justify-between">
                <span className="arte-ic arte-ic-gold"><Icon size={22} /></span>
                <span className="text-3xl font-bold" style={{ color: "rgba(180,150,80,0.35)" }}>{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg leading-snug">{p.t}</h3>
              <p className="mt-1.5 text-sm">{p.d}</p>
            </div>
          )
        })}
      </div>

      {/* O que dá para ganhar */}
      <div className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl">O que você pode ganhar</h2>
          <p className="mx-auto mt-3 max-w-xl">Nesta fase de lançamento, caprichamos: são muitos contemplados a cada rodada.</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="arte-card p-7">
            <span className="arte-ic arte-ic-gold"><Percent size={22} /></span>
            <h3 className="mt-4 text-xl">Descontos de até 50%</h3>
            <p className="mt-2 text-sm leading-relaxed">
              A maioria dos códigos dá um voucher de desconto para a sua próxima compra. Quanto mais
              você participa, mais chances de colecionar prêmios.
            </p>
          </div>
          <div className="arte-card p-7" style={{ background: "linear-gradient(150deg, rgba(150,190,160,0.28), rgba(228,203,144,0.22))" }}>
            <span className="arte-ic arte-ic-gold"><Gift size={22} /></span>
            <h3 className="mt-4 text-xl">Quebra-cabeça grátis</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Alguns códigos, mais raros, valem um <strong>quebra-cabeça grátis</strong> de outro Santo.
              São poucos por rodada — pode ser você!
            </p>
          </div>
        </div>
      </div>

      {/* Regras simples */}
      <div className="arte-card mt-12 p-7">
        <h2 className="text-2xl">Regras simples e transparentes</h2>
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex gap-3">
            <Church size={18} className="mt-0.5 shrink-0" style={{ color: "var(--arte-gold-deep)" }} />
            <span><strong>O prêmio é para outro Santo.</strong> O voucher vale para qualquer Santo da coleção, exceto o da própria caixa — assim você conhece novas devoções e completa a coleção.</span>
          </li>
          <li className="flex gap-3">
            <Ticket size={18} className="mt-0.5 shrink-0" style={{ color: "var(--arte-gold-deep)" }} />
            <span><strong>Cada código vale uma vez</strong> e é pessoal — fica guardado na sua conta assim que você resgata.</span>
          </li>
          <li className="flex gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0" style={{ color: "var(--arte-gold-deep)" }} />
            <span><strong>Validade de 90 dias.</strong> Depois de resgatar, você tem 90 dias para usar o voucher na loja.</span>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl">Pronto para tentar a sorte?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/loja" className="arte-btn arte-btn-primary">Comprar um quebra-cabeça <ArrowRight size={16} /></Link>
          <Link href="/minha-conta/sorte" className="arte-btn arte-btn-ghost">Já tenho um código</Link>
        </div>
      </div>
    </div>
  )
}
