// src/app/(site)/page.tsx — Landing de divulgação da Arte & Tradição
import Link from "next/link";
import {
  Puzzle, Brain, Album, Sparkles, QrCode, Heart, ArrowRight,
  Church, HandHeart, Palette, Users,
} from "lucide-react";
import { AlbumVitrine } from "./_components/album-vitrine";

const produtos = [
  {
    icon: Puzzle, tint: "arte-ic-gold", tag: "Nosso clássico", tagClass: "arte-tag arte-tag-hist",
    nome: "Quebra-cabeças dos Santos",
    desc: "Montar peça por peça a imagem de um Santo — e, ao final, conhecer sua história, sua data e sua oração. O produto que deu origem a tudo.",
  },
  {
    icon: Brain, tint: "arte-ic-sage", tag: "Novidade", tagClass: "arte-tag",
    nome: "Jogo da Memória dos Santos",
    desc: "Encontre os pares: o Santo e o seu símbolo — São Jorge e o dragão, Santa Luzia e os olhos, São Pedro e as chaves. Aprender iconografia brincando.",
  },
  {
    icon: Album, tint: "arte-ic-blush", tag: "Novidade", tagClass: "arte-tag",
    nome: "Álbum de Figurinhas dos Santos",
    desc: "Cada produto traz um código. Escaneie, revele a figurinha e cole no seu álbum digital. Complete a coleção e conheça toda a comunhão dos Santos.",
  },
];

const devocoes = ["Nossa Senhora", "Apóstolos", "Santos do Brasil", "Anjos", "Mártires", "Doutores da Igreja"];

export default function Home() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden">
        <div className="arte-halo" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl px-5 pt-20 pb-24 text-center">
          <span className="arte-eyebrow arte-rise">
            <Sparkles size={14} /> Devoção que se brinca
          </span>

          <h1 className="arte-rise arte-rise-2 mx-auto mt-5 max-w-4xl text-[2.6rem] leading-[1.05] sm:text-6xl">
            A fé e a tradição<br />
            <span style={{ color: "var(--arte-gold-deep)" }}>que passam de mão em mão</span>
          </h1>

          <p className="arte-rise arte-rise-3 mx-auto mt-6 max-w-2xl text-lg">
            Somos a <strong style={{ color: "var(--arte-ink)" }}>Arte&nbsp;&amp;&nbsp;Tradição</strong>. Criamos
            quebra-cabeças, jogos da memória e álbuns de figurinhas dos Santos da Igreja Católica —
            arte sacra que une devoção, aprendizado e o prazer de brincar em família.
          </p>

          <div className="arte-rise arte-rise-4 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/loja" className="arte-btn arte-btn-primary">
              Conheça a loja <ArrowRight size={17} />
            </Link>
            <Link href="/#produtos" className="arte-btn arte-btn-ghost">
              Ver os produtos
            </Link>
          </div>

          <div className="arte-rise arte-rise-4 mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs" style={{ color: "var(--arte-ink-soft)" }}>
            <span className="inline-flex items-center gap-1.5"><HandHeart size={14} style={{ color: "var(--arte-gold-deep)" }} /> Feito à mão, com fé</span>
            <span className="inline-flex items-center gap-1.5"><Palette size={14} style={{ color: "var(--arte-gold-deep)" }} /> Iconografia fiel</span>
            <span className="inline-flex items-center gap-1.5"><Users size={14} style={{ color: "var(--arte-gold-deep)" }} /> Para toda a família</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUTOS ═══════════════ */}
      <section id="produtos" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
        <div className="text-center">
          <div className="arte-rule-short mx-auto" />
          <h2 className="mt-5 text-3xl sm:text-4xl">Três formas de brincar com os Santos</h2>
          <p className="mx-auto mt-3 max-w-xl">Do tabuleiro ao álbum digital — cada produto é uma pequena catequese.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {produtos.map(({ icon: Icon, tint, tag, tagClass, nome, desc }) => (
            <article key={nome} className="arte-card flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className={`arte-ic ${tint}`}><Icon size={26} strokeWidth={1.9} /></span>
                <span className={tagClass}>{tag}</span>
              </div>
              <h3 className="mt-5 text-xl">{nome}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed">{desc}</p>
              <Link href="/loja" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--arte-gold-deep)" }}>
                Ver na loja <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════ ÁLBUM — physical to digital ═══════════════ */}
      <section className="arte-band">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <span className="arte-eyebrow"><QrCode size={14} /> Do papel para a coleção</span>
            <h2 className="mt-4 text-3xl sm:text-4xl">Um código em cada produto vira uma figurinha no seu álbum</h2>
            <p className="mt-4">
              Comprou um produto? Ele traz um código único. Escaneie o QR, revele o Santo
              e cole a figurinha no seu álbum digital. Acompanhe seu progresso, complete
              coleções inteiras e descubra a história de cada Santo pelo caminho.
            </p>
            <ol className="mt-7 space-y-4">
              {[
                { n: "1", t: "Escaneie o código", d: "No pacotinho ou na caixa do produto." },
                { n: "2", t: "Revele a figurinha", d: "Um Santo da coleção aparece — pode ser raro!" },
                { n: "3", t: "Cole no álbum", d: "Ele entra na sua coleção e conta sua história." },
              ].map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="arte-ic arte-ic-gold shrink-0" style={{ width: 40, height: 40, borderRadius: 12, fontWeight: 700 }}>{s.n}</span>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--arte-ink)" }}>{s.t}</p>
                    <p className="text-sm">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Álbum com os Santos reais do catálogo */}
          <AlbumVitrine />
        </div>
      </section>

      {/* ═══════════════ HISTÓRIA ═══════════════ */}
      <section id="historia" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 text-center">
        <span className="arte-ic arte-ic-gold mx-auto"><Church size={26} strokeWidth={1.9} /></span>
        <h2 className="mt-6 text-3xl sm:text-4xl">Um legado de família</h2>
        <p className="mt-5 text-lg">
          A Arte&nbsp;&amp;&nbsp;Tradição nasceu do desejo de aproximar as famílias dos Santos por meio da
          arte e da brincadeira. O que começou com quebra-cabeças cresce agora numa plataforma que
          reúne nossos produtos, nossa história e a comunhão dos Santos — para que a fé continue passando
          de geração em geração.
        </p>
        <hr className="arte-rule mx-auto mt-10 max-w-xs" />
      </section>

      {/* ═══════════════ SANTOS / DEVOÇÕES ═══════════════ */}
      <section id="santos" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-8">
        <div className="text-center">
          <span className="arte-eyebrow"><Heart size={14} /> Nossas coleções</span>
          <h2 className="mt-4 text-3xl sm:text-4xl">Devoções que você encontra aqui</h2>
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {devocoes.map((d) => (
            <span key={d} className="arte-card px-5 py-2.5 text-sm font-medium" style={{ color: "var(--arte-ink)" }}>
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="arte-card relative overflow-hidden px-8 py-14 text-center">
          <div className="arte-halo" aria-hidden />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl">Leve a tradição para a sua casa</h2>
            <p className="mx-auto mt-3 max-w-xl">Descubra nossos produtos e comece a sua coleção de Santos hoje.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/loja" className="arte-btn arte-btn-primary">Ir para a loja <ArrowRight size={17} /></Link>
              <Link href="/login" className="arte-btn arte-btn-ghost">Área administrativa</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
