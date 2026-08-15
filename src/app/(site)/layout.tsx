// src/app/(site)/layout.tsx
// Layout do site público da Arte & Tradição — tema pastel isolado do painel.
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./theme-arte.css";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { CartProvider } from "./_components/cart/cart-context";

// Serifa clássica para títulos — evoca missais e arte sacra
const arteSerif = Cormorant_Garamond({
  variable: "--font-arte-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Devoção que se brinca",
    template: "%s | Arte & Tradição",
  },
  description:
    "Quebra-cabeças, jogos da memória e álbuns de figurinhas dos Santos. Arte sacra que une fé, tradição e o prazer de brincar em família.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className={`${arteSerif.variable} arte-site`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
