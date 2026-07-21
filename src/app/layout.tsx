// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { QueryClientContext } from "@/providers/queryclient";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arteetradicao.com.br"),
  title: {
    default: "Arte & Tradição",
    template: "%s | Arte & Tradição",
  },
  description: "Quebra-cabeças, jogos da memória e álbuns de figurinhas dos Santos. Arte sacra que une fé, tradição e o prazer de brincar em família.",
  keywords: ["santos", "quebra-cabeça", "jogo da memória", "álbum de figurinhas", "arte sacra", "católico", "devoção"],
  authors: [{ name: "Arte & Tradição" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://arteetradicao.com.br",
    siteName: "Arte & Tradição",
    title: "Arte & Tradição — Devoção que se brinca",
    description: "Quebra-cabeças, jogos da memória e álbuns de figurinhas dos Santos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arte & Tradição",
    description: "Produtos devocionais lúdicos inspirados nos Santos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Script injetado no <head> — executa ANTES do React hidratar.
// Lê a preferência salva e aplica a classe .dark no <html> imediatamente,
// evitando o flash de tema errado na primeira renderização.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('cfy-theme');
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // padrão é escuro
      document.documentElement.classList.add('dark');
    }
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      {/* Script de tema roda antes da hidratação — sem flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionAuthProvider>
          <QueryClientContext>
            {children}
            <Toaster position="top-right" richColors duration={2500} />
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
