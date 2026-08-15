import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AppShell } from "./_components/app-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/dashboard")

  // Painel é só para equipe (admin/lojista). Comprador vai para a área dele.
  if (session.user.role === "CLIENTE") redirect("/minha-conta")

  return (
    <AppShell
      role={session.user.role}
      userName={session.user.name ?? null}
      userEmail={session.user.email ?? null}
    >
      {children}
    </AppShell>
  )
}
