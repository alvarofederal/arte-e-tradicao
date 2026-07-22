// prisma/seed.ts — Semeia um usuário administrador para login.
// Rode com: npm run db:seed
import "dotenv/config"
import { PrismaClient, Role } from "../src/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Credenciais lidas do ambiente (.env, não versionado). Assim a senha real
// não fica no repositório. Defina SEED_ADMIN_PASSWORD no .env.
const SENHA_PLACEHOLDER = "trocar-esta-senha"
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@arteetradicao.com.br"
const ADMIN_SENHA = process.env.SEED_ADMIN_PASSWORD ?? SENHA_PLACEHOLDER
const ADMIN_NOME = process.env.SEED_ADMIN_NOME ?? "Administrador Arte & Tradição"

async function main() {
  const senhaHash = await bcrypt.hash(ADMIN_SENHA, 12)

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: senhaHash,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
      ativo: true,
      name: ADMIN_NOME,
    },
    create: {
      email: ADMIN_EMAIL,
      password: senhaHash,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
      ativo: true,
      name: ADMIN_NOME,
    },
  })

  console.log("✔ Usuário admin pronto para login:")
  console.log("   e-mail:", user.email)
  if (ADMIN_SENHA === SENHA_PLACEHOLDER) {
    console.log("   ⚠ senha padrão de PLACEHOLDER:", SENHA_PLACEHOLDER)
    console.log("     Defina SEED_ADMIN_PASSWORD no .env e rode de novo para uma senha real.")
  } else {
    console.log("   senha : (definida via SEED_ADMIN_PASSWORD no .env)")
  }
  console.log("   role  :", user.role)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("Erro ao semear usuário:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
