"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCarrinho } from "./cart-context"

export function CartButton() {
  const { quantidade, pronto } = useCarrinho()
  return (
    <Link href="/loja/carrinho" className="relative inline-flex items-center justify-center rounded-full p-2 arte-navlink" aria-label="Carrinho">
      <ShoppingCart size={20} />
      {pronto && quantidade > 0 && (
        <span style={{
          position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, padding: "0 4px",
          borderRadius: 999, background: "var(--arte-gold)", color: "#fff",
          fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center", lineHeight: 1,
        }}>
          {quantidade}
        </span>
      )}
    </Link>
  )
}
