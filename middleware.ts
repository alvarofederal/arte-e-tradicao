import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Nota: não há redirecionamento de domínio canônico aqui.
  // Quando houver domínio próprio, configure o redirect no painel da Vercel
  // (Settings → Domains) — é o lugar certo, e evita 301 preso em cache.
  const { pathname } = request.nextUrl

  const publicRoutes = [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/auth",
  ]

  const isPublicRoute =
    pathname === "/" ||
    publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verifica apenas cookie — sem Prisma no middleware
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}