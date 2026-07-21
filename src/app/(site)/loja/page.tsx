// src/app/(site)/loja/page.tsx — Esqueleto do e-commerce (catálogo)
import type { Metadata } from "next";
import Link from "next/link";
import { Puzzle, Brain, Album, ShoppingBag, ArrowLeft, Construction } from "lucide-react";

export const metadata: Metadata = {
  title: "Loja",
  description: "Quebra-cabeças, jogos da memória e álbuns de figurinhas dos Santos.",
};

const categorias = [
  { icon: Puzzle, tint: "arte-ic-gold", nome: "Quebra-cabeças", n: "Nosso clássico" },
  { icon: Brain, tint: "arte-ic-sage", nome: "Jogos da Memória", n: "Novidade" },
  { icon: Album, tint: "arte-ic-blush", nome: "Álbuns de Figurinhas", n: "Novidade" },
];

// Produtos de exemplo (placeholder) — serão substituídos pelo catálogo real do banco.
const exemplos = [
  { nome: "Quebra-cabeça · Nossa Senhora Aparecida", pecas: "300 peças", preco: "R$ 89,90", tint: "arte-ic-gold", icon: Puzzle },
  { nome: "Memória · Santos do Brasil", pecas: "32 cartas", preco: "R$ 59,90", tint: "arte-ic-sage", icon: Brain },
  { nome: "Álbum · Apóstolos", pecas: "60 figurinhas", preco: "R$ 49,90", tint: "arte-ic-blush", icon: Album },
  { nome: "Quebra-cabeça · São Francisco", pecas: "500 peças", preco: "R$ 99,90", tint: "arte-ic-gold", icon: Puzzle },
  { nome: "Memória · Anjos", pecas: "24 cartas", preco: "R$ 54,90", tint: "arte-ic-sage", icon: Brain },
  { nome: "Álbum · Nossa Senhora", pecas: "48 figurinhas", preco: "R$ 44,90", tint: "arte-ic-blush", icon: Album },
];

export default function Loja() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/" className="arte-navlink inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Voltar ao início
      </Link>

      <header className="mt-6 text-center">
        <span className="arte-eyebrow"><ShoppingBag size={14} /> Loja Arte &amp; Tradição</span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Nossos produtos</h1>
        <p className="mx-auto mt-3 max-w-xl">Devoção, arte e brincadeira para todas as idades.</p>
      </header>

      {/* Categorias */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {categorias.map(({ icon: Icon, tint, nome, n }) => (
          <div key={nome} className="arte-card flex items-center gap-4 p-5">
            <span className={`arte-ic ${tint}`}><Icon size={24} strokeWidth={1.9} /></span>
            <div>
              <p className="font-semibold" style={{ color: "var(--arte-ink)" }}>{nome}</p>
              <p className="text-xs" style={{ color: "var(--arte-ink-soft)" }}>{n}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Aviso de esqueleto */}
      <div className="arte-card mt-8 flex items-center gap-3 p-4" style={{ background: "rgba(201,162,75,0.10)" }}>
        <Construction size={18} style={{ color: "var(--arte-gold-deep)" }} />
        <p className="text-sm" style={{ color: "var(--arte-ink)" }}>
          Vitrine de exemplo. O catálogo real será conectado ao banco de dados e ao checkout na
          <strong> Release 2 — E-commerce</strong> (ver <code>specs/002-ecommerce</code>).
        </p>
      </div>

      {/* Grade de produtos (placeholder) */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exemplos.map(({ nome, pecas, preco, tint, icon: Icon }) => (
          <article key={nome} className="arte-card overflow-hidden">
            <div className="grid aspect-[4/3] place-items-center" style={{ background: "linear-gradient(160deg, rgba(228,203,144,0.25), rgba(169,193,217,0.15))" }}>
              <span className={`arte-ic ${tint}`} style={{ width: 64, height: 64 }}><Icon size={30} strokeWidth={1.7} /></span>
            </div>
            <div className="p-5">
              <h3 className="text-lg leading-snug">{nome}</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--arte-ink-soft)" }}>{pecas}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold" style={{ color: "var(--arte-gold-deep)" }}>{preco}</span>
                <button className="arte-btn arte-btn-ghost arte-btn-sm" disabled title="Disponível na Release 2">
                  Em breve
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
