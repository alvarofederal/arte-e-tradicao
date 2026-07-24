// Cadastra o catálogo inicial de Santos, numerado a partir de 001.
// ATENÇÃO: apaga os cards existentes (eram apenas os de teste).
// Rode com: npx tsx scripts/seed-santos.ts
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()

/* Paleta de moldura por tema devocional */
const AZUL_MARIANO = "#2F5AA8"
const DOURADO = "#A67C2E"
const VINHO = "#8C2F39"
const VERDE = "#3E7D5F"
const MARROM = "#7A5C3E"

const estiloBase = {
  frenteBg: "#EEE6D5",
  frenteBg2: "#E3D8C0",
  usarGradiente: false,
  faixaCor: "#F5ECD6",
  nomeCor: "#2E2A26",
  subtituloCor: "#3B322E",
  brilho: false,
  holografico: false,
  bordaEstilo: "classica",
  bordaLargura: 10,
  versoBg: "#FBF6EC",
  versoTextoCor: "#2E2A26",
  acento: "#C9A24B",
  imgScale: 1,
  imgPosX: 50,
  imgPosY: 50,
}

interface Santo {
  nome: string
  dataFesta: string
  descricao: string
  cor: string
}

/* Ordem = ordem das imagens enviadas pelo Álvaro. */
const SANTOS: Santo[] = [
  {
    nome: "Nossa Senhora de Guadalupe",
    dataFesta: "12/12",
    cor: AZUL_MARIANO,
    descricao:
      "Em 1531, no monte Tepeyac, a Virgem apareceu ao indígena São Juan Diego e deixou sua imagem gravada na tilma. Padroeira das Américas, é venerada como a Mãe que acolhe todos os povos.",
  },
  {
    nome: "Nossa Senhora do Perpétuo Socorro",
    dataFesta: "27/06",
    cor: AZUL_MARIANO,
    descricao:
      "Ícone bizantino em que o Menino Jesus, ao contemplar os instrumentos da Paixão, busca a mão da Mãe. É invocada por todos os que precisam de auxílio urgente e constante.",
  },
  {
    nome: "Sagrada Família",
    dataFesta: "", // festa móvel: domingo dentro da oitava do Natal
    cor: DOURADO,
    descricao:
      "Fugindo de Herodes, José conduziu Maria e o Menino ao Egito. A Sagrada Família é modelo de fé, obediência e amor para todos os lares cristãos.",
  },
  {
    nome: "Imaculada Conceição",
    dataFesta: "08/12",
    cor: AZUL_MARIANO,
    descricao:
      "Preservada do pecado original desde o primeiro instante de sua existência, Maria é a cheia de graça. Padroeira do Brasil, é celebrada em 8 de dezembro.",
  },
  {
    nome: "Imaculado Coração de Maria",
    dataFesta: "", // festa móvel: sábado seguinte ao Sagrado Coração de Jesus
    cor: AZUL_MARIANO,
    descricao:
      "O Coração da Virgem, traspassado pela espada anunciada por Simeão, arde de amor por Deus e pelos homens. Em Fátima, Nossa Senhora pediu a devoção ao seu Imaculado Coração.",
  },
  {
    nome: "Santo Inácio de Loyola",
    dataFesta: "31/07",
    cor: VINHO,
    descricao:
      "Soldado ferido em Pamplona, converteu-se lendo a vida de Cristo e dos santos. Fundou a Companhia de Jesus e deixou os Exercícios Espirituais — tudo para a maior glória de Deus.",
  },
  {
    nome: "Santo Afonso Maria de Ligório",
    dataFesta: "01/08",
    cor: VINHO,
    descricao:
      "Advogado que trocou os tribunais pelo altar. Fundou os Redentoristas, foi bispo e Doutor da Igreja, mestre da teologia moral e da misericórdia com os pecadores.",
  },
  {
    nome: "São João Bosco",
    dataFesta: "31/01",
    cor: MARROM,
    descricao:
      "Pai e mestre da juventude. Nas ruas de Turim acolheu meninos pobres e criou o sistema preventivo, educando com razão, religião e amor. Fundou os Salesianos.",
  },
  {
    nome: "São Bento",
    dataFesta: "11/07",
    cor: VERDE,
    descricao:
      "Patriarca do monaquismo ocidental. Sua Regra, resumida no ora et labora, formou a Europa cristã. É invocado como poderoso protetor contra o mal.",
  },
  {
    nome: "São José",
    dataFesta: "19/03",
    cor: DOURADO,
    descricao:
      "Esposo de Maria e pai adotivo de Jesus. Homem justo e silencioso, guardou a Sagrada Família com o trabalho de suas mãos. Padroeiro da Igreja universal e dos trabalhadores.",
  },
  {
    nome: "São Francisco de Sales",
    dataFesta: "24/01",
    cor: VINHO,
    descricao:
      "Bispo de Genebra e Doutor da Igreja, conquistou os corações pela mansidão. Ensinou que a santidade é para todos, em qualquer estado de vida. Padroeiro dos escritores.",
  },
  {
    nome: "Santo Tomás de Aquino",
    dataFesta: "28/01",
    cor: VINHO,
    descricao:
      "O Doutor Angélico, maior teólogo da Igreja. Uniu fé e razão na Suma Teológica e, diante de uma visão de Deus, declarou que tudo o que escrevera lhe parecia palha.",
  },
  {
    nome: "São Camilo de Léllis",
    dataFesta: "14/07",
    cor: MARROM,
    descricao:
      "Soldado e jogador convertido, dedicou a vida aos enfermos. Fundou os Ministros dos Enfermos, que levam a cruz vermelha no peito. Padroeiro dos hospitais e dos doentes.",
  },
  {
    nome: "São João da Cruz",
    dataFesta: "14/12",
    cor: VERDE,
    descricao:
      "Carmelita, poeta e místico, companheiro de Santa Teresa d'Ávila na reforma da Ordem. Na prisão escreveu versos sublimes sobre a noite escura que conduz à união com Deus.",
  },
]

async function main() {
  const existentes = await db.cardSanto.count()
  if (existentes > 0) {
    console.log(`Apagando ${existentes} card(s) de teste para começar do 001...`)
    await db.cardSanto.deleteMany({})
  }

  let numero = 1
  for (const s of SANTOS) {
    await db.cardSanto.create({
      data: {
        numero,
        nome: s.nome,
        dataFesta: s.dataFesta || null,
        descricao: s.descricao,
        imagem: null, // anexar com scripts/anexar-imagens.ts
        estilo: { ...estiloBase, bordaCor: s.cor },
      },
    })
    console.log(`  #${String(numero).padStart(3, "0")}  ${s.nome}${s.dataFesta ? ` (${s.dataFesta})` : "  [data a definir]"}`)
    numero++
  }

  console.log(`\n✔ ${SANTOS.length} Santos cadastrados, numerados de 001 a ${String(SANTOS.length).padStart(3, "0")}.`)
  console.log("  Faltam as imagens → rode: npx tsx scripts/anexar-imagens.ts")
}

main().catch(console.error).finally(() => db.$disconnect())
