import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que EXIGEM sessão. Todo o resto (site, loja, páginas dos Santos,
// login/registro) é público. A loja é uma vitrine aberta — só o checkout,
// os pedidos e o painel pedem login.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/minha-conta",
  "/loja/checkout",
  "/loja/pedido",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  )

  if (!needsAuth) {
    return NextResponse.next()
  }

  // Verifica apenas o cookie — sem Prisma no middleware (edge).
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  if (!sessionToken) {
    const login = new URL("/login", request.url)
    login.searchParams.set("callbackUrl", pathname + request.nextUrl.search)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
