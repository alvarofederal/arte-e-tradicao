// A augmentação de Session/JWT vive em src/lib/auth.ts.
// Este arquivo mantém apenas o mínimo para o NextAuth.
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

export {}
