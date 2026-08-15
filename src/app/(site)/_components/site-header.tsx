// Cabeçalho do site público — navbar em vidro, logo com cruz dourada.
import Link from "next/link";
import { Cross, ShoppingBag } from "lucide-react";
import { CartButton } from "./cart/cart-button";
import { AccountLink } from "./account-link";

const nav = [
  { href: "/loja", label: "Loja" },
  { href: "/santos", label: "Santos" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/#historia", label: "Nossa história" },
];

export function SiteHeader() {
  return (
    <header className="arte-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Arte & Tradição — início">
          <span className="arte-ic arte-ic-gold" style={{ width: 40, height: 40, borderRadius: 12 }}>
            <Cross size={20} strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="arte-display block text-[1.15rem]" style={{ color: "var(--arte-ink)" }}>
              Arte&nbsp;&amp;&nbsp;Tradição
            </span>
            <span className="block text-[0.62rem] tracking-[0.22em] uppercase" style={{ color: "var(--arte-gold-deep)" }}>
              Santos · Fé · Brincar
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="arte-navlink text-sm">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <AccountLink />
          <CartButton />
          <Link href="/loja" className="arte-btn arte-btn-primary arte-btn-sm">
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Loja</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
