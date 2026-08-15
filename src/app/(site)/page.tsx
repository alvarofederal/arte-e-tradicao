// src/app/(site)/page.tsx — Landing de divulgação da Arte & Tradição
import Link from "next/link";
import {
  Puzzle, Brain, Clover, Sparkles, Gift, Heart, ArrowRight,
  Church, HandHeart, Palette, Users, Ticket,
} from "lucide-react";

const produtos = [
  {
    icon: Puzzle, tint: "arte-ic-gold", tag: "Nosso clássico", tagClass: "arte-tag arte-tag-hist",
    nome: "Quebra-cabeças dos Santos",
    desc: "Montar peça por peça a imagem de um Santo — e, ao final, conhecer sua história, sua data e sua oração. O produto que deu origem a tudo.",
    href: "/loja", cta: "Ver na loja",
  },
  {
    icon: Clover, tint: "arte-ic-sage", tag: "Em cada caixa", tagClass: "arte-tag",
    nome: "Código da Sorte",
    desc: "Todo quebra-cabeça traz um código premiado na embalagem. Cadastre-se, tente a sorte e ganhe descontos — ou até um quebra-cabeça grátis de outro Santo.",
    href: "/como-funciona", cta: "Como funciona",
  },
  {
    icon: Brain, tint: "arte-ic-blush", tag: "Em breve", tagClass: "arte-tag",
    nome: "Jogo da Memória dos Santos",
    desc: "Encontre os pares: o Santo e o seu símbolo — São Jorge e o dragão, Santa Luzia e os olhos, São Pedro e as chaves. Aprender iconografia brincando.",
    href: null, cta: null,
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
            <strong style={{ color: "var(--arte-ink)" }}> quebra-cabeças dos Santos</strong> da Igreja Católica —
            arte sacra que une devoção, aprendizado e o prazer de brincar em família. E cada caixa
            pode premiar você.
          </p>

          <div className="arte-rise arte-rise-4 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/loja" className="arte-btn arte-btn-primary">
              Conheça a loja <ArrowRight size={17} />
            </Link>
            <Link href="/como-funciona" className="arte-btn arte-btn-ghost">
              Como funciona a premiação
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
          <h2 className="mt-5 text-3xl sm:text-4xl">Devoção que vira brincadeira</h2>
          <p className="mx-auto mt-3 max-w-xl">Nossos quebra-cabeças dos Santos — e a sorte que vem em cada caixa.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {produtos.map(({ icon: Icon, tint, tag, tagClass, nome, desc, href, cta }) => (
            <article key={nome} className="arte-card flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className={`arte-ic ${tint}`}><Icon size={26} strokeWidth={1.9} /></span>
                <span className={tagClass}>{tag}</span>
              </div>
              <h3 className="mt-5 text-xl">{nome}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed">{desc}</p>
              {href ? (
                <Link href={href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--arte-gold-deep)" }}>
                  {cta} <ArrowRight size={15} />
                </Link>
              ) : (
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--arte-ink-soft)" }}>
                  Em breve
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════ CÓDIGO DA SORTE — premiação ═══════════════ */}
      <section id="premiacao" className="arte-band scroll-mt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <span className="arte-eyebrow"><Clover size={14} /> Código da Sorte</span>
            <h2 className="mt-4 text-3xl sm:text-4xl">Cada caixa pode premiar você</h2>
            <p className="mt-4">
              Todo quebra-cabeça vem com um <strong>código único</strong> impresso na embalagem.
              Cadastre-se no site, digite o código em <em>“Tente a sorte”</em> e descubra na hora o
              seu prêmio: um <strong>desconto de até 50%</strong> — ou, com sorte, um
              <strong> quebra-cabeça grátis</strong> de outro Santo.
            </p>
            <ol className="mt-7 space-y-4">
              {[
                { n: "1", t: "Compre e receba o código", d: "Ele vem impresso na caixa do seu quebra-cabeça." },
                { n: "2", t: "Cadastre-se e tente a sorte", d: "Digite o código no seu perfil. Comprou 5 caixas? São 5 tentativas." },
                { n: "3", t: "Ganhe e use na próxima", d: "O prêmio vira um voucher para levar outro Santo da coleção." },
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
            <Link href="/como-funciona" className="arte-btn arte-btn-primary mt-8">
              Entenda a premiação <ArrowRight size={16} />
            </Link>
          </div>

          {/* Bilhete premiado (ilustração) */}
          <div className="grid place-items-center">
            <div className="w-full max-w-sm rounded-3xl p-8 text-center" style={{ background: "linear-gradient(150deg, rgba(228,203,144,0.5), rgba(150,190,160,0.35))", border: "1px solid var(--arte-line)", boxShadow: "0 24px 60px -30px rgba(59,50,46,0.5)" }}>
              <span className="arte-ic arte-ic-gold mx-auto" style={{ width: 54, height: 54 }}><Ticket size={26} /></span>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--arte-gold-deep)" }}>Seu prêmio</p>
              <p className="mt-1 text-6xl font-bold" style={{ color: "var(--arte-ink)" }}>até 50%</p>
              <p className="mt-1 text-lg">de desconto</p>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1" style={{ background: "var(--arte-line)" }} />
                <span className="text-xs uppercase tracking-widest" style={{ color: "var(--arte-ink-soft)" }}>ou</span>
                <span className="h-px flex-1" style={{ background: "var(--arte-line)" }} />
              </div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-lg font-bold" style={{ color: "#3B6B4A" }}>
                <Gift size={18} /> um Santo grátis
              </p>
              <p className="mt-4 font-mono text-xs tracking-[0.2em]" style={{ color: "var(--arte-ink-soft)" }}>XXXX-XXXX-XXXX-XXXX</p>
            </div>
          </div>
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
        <div className="mt-8 text-center">
          <Link href="/santos" className="arte-btn arte-btn-ghost">
            Conheça todos os Santos <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="arte-card relative overflow-hidden px-8 py-14 text-center">
          <div className="arte-halo" aria-hidden />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl">Leve a tradição para a sua casa</h2>
            <p className="mx-auto mt-3 max-w-xl">Descubra nossos quebra-cabeças e comece a sua coleção de Santos hoje.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/loja" className="arte-btn arte-btn-primary">Ir para a loja <ArrowRight size={17} /></Link>
              <Link href="/como-funciona" className="arte-btn arte-btn-ghost">Como funciona a premiação</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
