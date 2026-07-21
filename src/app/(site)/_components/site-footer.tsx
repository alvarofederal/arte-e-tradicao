// Rodapé do site público.
import Link from "next/link";
import { Cross, Instagram, MessageCircle, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="arte-footer mt-24">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="arte-ic arte-ic-gold" style={{ width: 38, height: 38, borderRadius: 11 }}>
                <Cross size={18} strokeWidth={2.2} />
              </span>
              <span className="arte-display text-lg" style={{ color: "var(--arte-ink)" }}>
                Arte &amp; Tradição
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm">
              Produtos devocionais lúdicos inspirados nos Santos da Igreja Católica.
              Fé e tradição que se transmitem brincando — um legado de família para as próximas gerações.
            </p>
          </div>

          <div>
            <h4 className="arte-display mb-3 text-base">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#produtos" className="arte-navlink">Nossos produtos</Link></li>
              <li><Link href="/loja" className="arte-navlink">Loja</Link></li>
              <li><Link href="/#santos" className="arte-navlink">Santos</Link></li>
              <li><Link href="/#historia" className="arte-navlink">Nossa história</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="arte-display mb-3 text-base">Contato</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="arte-navlink inline-flex items-center gap-2"><MessageCircle size={15} /> WhatsApp</a></li>
              <li><a href="#" className="arte-navlink inline-flex items-center gap-2"><Instagram size={15} /> Instagram</a></li>
              <li><a href="#" className="arte-navlink inline-flex items-center gap-2"><Mail size={15} /> E-mail</a></li>
            </ul>
          </div>
        </div>

        <hr className="arte-rule my-8" />
        <div className="flex flex-col items-center justify-between gap-2 text-xs sm:flex-row" style={{ color: "var(--arte-ink-soft)" }}>
          <span>© {new Date().getFullYear()} Arte &amp; Tradição. Feito com fé.</span>
          <span>Ad maiorem Dei gloriam</span>
        </div>
      </div>
    </footer>
  );
}
