/**
 * Segundo lote do catálogo: ~50 Santos populares.
 * NÃO apaga nada — continua a numeração global a partir do maior nº atual.
 * Idempotente: pula quem já existe (pelo nome). Imagens ficam para depois
 * (anexar com scripts/anexar-imagens.ts, nomeando pelos números impressos abaixo).
 *
 * Rode com: npx tsx scripts/seed-santos-lote2.ts
 */
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"

const db = new PrismaClient()

const AZUL = "#2F5AA8"      // Marianas
const DOURADO = "#A67C2E"   // Apóstolos e Arcanjos
const VINHO = "#8C2F39"     // Doutores e Mártires
const VERDE = "#3E7D5F"     // Monásticos e contemplativos
const MARROM = "#7A5C3E"    // Caridade, pastoral e devoções

const estiloBase = {
  frenteBg: "#EEE6D5", frenteBg2: "#E3D8C0", usarGradiente: false,
  faixaCor: "#F5ECD6", nomeCor: "#2E2A26", subtituloCor: "#3B322E",
  brilho: false, holografico: false,
  bordaEstilo: "classica", bordaLargura: 10,
  versoBg: "#FBF6EC", versoTextoCor: "#2E2A26", acento: "#C9A24B",
  imgScale: 1, imgPosX: 50, imgPosY: 50,
}

interface Santo { nome: string; dataFesta: string; cor: string; descricao: string }

const SANTOS: Santo[] = [
  // ── Apóstolos e Evangelistas ──
  { nome: "São Pedro Apóstolo", dataFesta: "29/06", cor: DOURADO, descricao: "Pescador da Galileia, escolhido por Cristo como pedra sobre a qual edificou a Igreja. Primeiro Papa, guarda as chaves do Reino dos Céus." },
  { nome: "São Paulo Apóstolo", dataFesta: "29/06", cor: DOURADO, descricao: "De perseguidor a Apóstolo dos gentios após o encontro com Cristo no caminho de Damasco. Suas cartas são coração do Novo Testamento." },
  { nome: "Santo André Apóstolo", dataFesta: "30/11", cor: DOURADO, descricao: "Irmão de Pedro e primeiro chamado por Jesus. Pregou o Evangelho e foi crucificado numa cruz em forma de X, que leva o seu nome." },
  { nome: "São João Evangelista", dataFesta: "27/12", cor: DOURADO, descricao: "O discípulo amado, que reclinou a cabeça sobre o peito do Senhor. Aos pés da cruz recebeu Maria como Mãe e escreveu o quarto Evangelho." },
  { nome: "São Tiago Maior", dataFesta: "25/07", cor: DOURADO, descricao: "Apóstolo e irmão de João, primeiro a dar a vida por Cristo. Sua tumba em Compostela é destino de peregrinos de todo o mundo." },
  { nome: "São Mateus", dataFesta: "21/09", cor: DOURADO, descricao: "Cobrador de impostos que deixou tudo ao ouvir 'Segue-me'. Escreveu o Evangelho que anuncia Jesus como o Messias prometido." },
  { nome: "São Tomé Apóstolo", dataFesta: "03/07", cor: DOURADO, descricao: "Quis tocar as chagas para crer e proclamou 'Meu Senhor e meu Deus'. Levou o Evangelho até a Índia." },
  { nome: "São Judas Tadeu", dataFesta: "28/10", cor: DOURADO, descricao: "Apóstolo invocado nas causas difíceis e desesperadas. Fiel amigo de Jesus, socorre os que a Ele recorrem com confiança." },

  // ── Arcanjos ──
  { nome: "São Miguel Arcanjo", dataFesta: "29/09", cor: DOURADO, descricao: "Príncipe das milícias celestes, que combate o mal com a espada de fogo. 'Quem como Deus?' é o brado do seu nome." },
  { nome: "São Gabriel Arcanjo", dataFesta: "29/09", cor: DOURADO, descricao: "Mensageiro de Deus, anunciou a Maria a Encarnação do Verbo. Padroeiro das comunicações e dos que levam boas-novas." },
  { nome: "São Rafael Arcanjo", dataFesta: "29/09", cor: DOURADO, descricao: "'Deus cura' — guiou o jovem Tobias e devolveu a vista a seu pai. Protetor dos viajantes, dos enfermos e dos noivos." },

  // ── Marianas ──
  { nome: "Nossa Senhora Aparecida", dataFesta: "12/10", cor: AZUL, descricao: "A pequena imagem encontrada nas águas do rio Paraíba tornou-se Padroeira do Brasil. Mãe que acolhe o povo humilde e devoto." },
  { nome: "Nossa Senhora de Fátima", dataFesta: "13/05", cor: AZUL, descricao: "Em 1917 apareceu a três pastorinhos em Fátima, pedindo oração e penitência. Anunciou o triunfo do seu Imaculado Coração." },
  { nome: "Nossa Senhora de Lourdes", dataFesta: "11/02", cor: AZUL, descricao: "À jovem Bernadette apresentou-se como 'a Imaculada Conceição'. A fonte de Lourdes é sinal de cura para corpo e alma." },
  { nome: "Nossa Senhora do Carmo", dataFesta: "16/07", cor: AZUL, descricao: "Rainha do Monte Carmelo, entregou o santo escapulário como sinal de proteção. Padroeira dos carmelitas e das almas do purgatório." },

  // ── Franciscanos e Dominicanos ──
  { nome: "São Francisco de Assis", dataFesta: "04/10/1226", cor: VERDE, descricao: "O Poverello que desposou a Senhora Pobreza e recebeu os estigmas de Cristo. Cantou o irmão sol e a irmã lua, louvando o Criador." },
  { nome: "Santa Clara de Assis", dataFesta: "11/08/1253", cor: VERDE, descricao: "Seguiu Francisco na radicalidade do Evangelho e fundou as Clarissas. Diante do inimigo, ergueu a custódia e defendeu a cidade." },
  { nome: "Santo Antônio de Pádua", dataFesta: "13/06/1231", cor: MARROM, descricao: "Doutor evangélico e pregador incansável, retratado com o Menino Jesus. Invocado pelos que buscam o que perderam." },
  { nome: "São Domingos de Gusmão", dataFesta: "08/08/1221", cor: VERDE, descricao: "Fundador da Ordem dos Pregadores, difundiu o Santo Rosário. Combateu o erro com a verdade e a caridade." },

  // ── Doutores e místicos ──
  { nome: "Santa Teresa d'Ávila", dataFesta: "15/10/1582", cor: VINHO, descricao: "Reformadora do Carmelo e mestra da oração, primeira mulher Doutora da Igreja. No Castelo interior descreveu a alma em busca de Deus." },
  { nome: "Santa Teresinha do Menino Jesus", dataFesta: "01/10/1897", cor: VINHO, descricao: "A pequena flor de Lisieux, mestra do caminho da infância espiritual. Prometeu fazer cair do céu uma chuva de rosas." },
  { nome: "Santo Agostinho", dataFesta: "28/08/430", cor: VINHO, descricao: "Bispo de Hipona e Doutor da Igreja. Depois de longa busca confessou: 'Tarde vos amei, ó Beleza tão antiga e tão nova'." },
  { nome: "Santa Mônica", dataFesta: "27/08/387", cor: MARROM, descricao: "Mãe de Agostinho, que o gerou duas vezes: para a vida e para a fé. Modelo das mães que não desistem de orar pelos filhos." },
  { nome: "São Jerônimo", dataFesta: "30/09/420", cor: VINHO, descricao: "Traduziu as Escrituras para o latim na Vulgata. 'Ignorar as Escrituras é ignorar a Cristo', ensinou o Doutor de Belém." },
  { nome: "Santo Ambrósio", dataFesta: "07/12/397", cor: VINHO, descricao: "Bispo de Milão, pastor eloquente que batizou Agostinho. Doutor da Igreja, defendeu a fé diante dos poderosos." },
  { nome: "São Gregório Magno", dataFesta: "03/09/604", cor: VINHO, descricao: "Papa e Doutor da Igreja, servo dos servos de Deus. Reformou a liturgia e deu nome ao canto gregoriano." },
  { nome: "Santa Catarina de Sena", dataFesta: "29/04/1380", cor: VINHO, descricao: "Mística dominicana e Doutora da Igreja que aconselhou papas. Movida pelo amor, trabalhou pela paz e pela unidade da Igreja." },
  { nome: "São Boaventura", dataFesta: "15/07/1274", cor: VERDE, descricao: "Doutor Seráfico, teólogo franciscano e amigo de Tomás de Aquino. Uniu ciência e santidade no caminho da alma para Deus." },
  { nome: "São Bernardo de Claraval", dataFesta: "20/08/1153", cor: VERDE, descricao: "Abade cisterciense e Doutor Melífluo, cantor terno de Maria. Sua pregação incendiou a Europa de amor a Cristo." },

  // ── Mártires e virgens ──
  { nome: "São Jorge", dataFesta: "23/04/303", cor: VINHO, descricao: "Soldado mártir que, na tradição, venceu o dragão. Símbolo da fé que triunfa sobre o mal, é invocado como guerreiro de Cristo." },
  { nome: "São Sebastião", dataFesta: "20/01/288", cor: VINHO, descricao: "Soldado romano trespassado por flechas por confessar a fé. Protetor contra as pestes e defensor dos perseguidos." },
  { nome: "Santa Luzia", dataFesta: "13/12/304", cor: VINHO, descricao: "Virgem e mártir de Siracusa, cujo nome significa 'luz'. Padroeira dos olhos e dos que buscam a luz da fé." },
  { nome: "Santa Águeda", dataFesta: "05/02", cor: VINHO, descricao: "Virgem e mártir da Sicília, firme na fé em meio ao suplício. Invocada como protetora contra o fogo e as erupções." },
  { nome: "Santa Cecília", dataFesta: "22/11", cor: VINHO, descricao: "Virgem e mártir romana, que cantava a Deus no coração. Padroeira dos músicos e dos que louvam ao Senhor com arte." },
  { nome: "Santa Inês", dataFesta: "21/01/304", cor: VINHO, descricao: "Jovem virgem e mártir, consagrada a Cristo ainda menina. Seu nome evoca o cordeiro — símbolo de pureza e entrega." },
  { nome: "São Lourenço", dataFesta: "10/08/258", cor: VINHO, descricao: "Diácono mártir que apresentou os pobres como tesouros da Igreja. Deu a vida com serenidade sobre a grelha." },
  { nome: "Santo Estêvão", dataFesta: "26/12", cor: VINHO, descricao: "Primeiro mártir da Igreja, apedrejado enquanto perdoava. Viu os céus abertos e Cristo à direita do Pai." },
  { nome: "Santa Bárbara", dataFesta: "04/12", cor: VINHO, descricao: "Virgem e mártir, invocada contra os raios e as tempestades. Protetora dos que enfrentam perigos súbitos." },

  // ── Caridade, pastoral e evangelização ──
  { nome: "São Vicente de Paulo", dataFesta: "27/09/1660", cor: MARROM, descricao: "Apóstolo da caridade, pai dos pobres e dos abandonados. Fundou congregações a serviço dos que sofrem." },
  { nome: "São João Maria Vianney", dataFesta: "04/08/1859", cor: MARROM, descricao: "O Cura d'Ars, humilde pároco que passava horas no confessionário. Padroeiro dos sacerdotes, atraiu multidões a Deus." },
  { nome: "São Francisco Xavier", dataFesta: "03/12/1552", cor: MARROM, descricao: "Jesuíta companheiro de Inácio, missionário do Oriente. Batizou milhares e é padroeiro das missões." },
  { nome: "São Pio de Pietrelcina", dataFesta: "23/09/1968", cor: MARROM, descricao: "Capuchinho que trouxe os estigmas de Cristo por cinquenta anos. Confessor incansável, repetia: 'Reza, espera e não te preocupes'." },
  { nome: "São Maximiliano Kolbe", dataFesta: "14/08/1941", cor: MARROM, descricao: "Frade que ofereceu a própria vida por um pai de família em Auschwitz. Mártir da caridade e apóstolo de Maria Imaculada." },
  { nome: "Santa Faustina Kowalska", dataFesta: "05/10/1938", cor: MARROM, descricao: "Religiosa polonesa, secretária da Divina Misericórdia. Por ela o Senhor pediu a devoção 'Jesus, eu confio em Vós'." },
  { nome: "Santa Edith Stein", dataFesta: "09/08/1942", cor: VERDE, descricao: "Filósofa judia convertida, carmelita como Teresa Benta da Cruz. Mártir em Auschwitz, copadroeira da Europa." },
  { nome: "São Josemaría Escrivá", dataFesta: "26/06/1975", cor: MARROM, descricao: "Fundador do Opus Dei, pregou a santidade no trabalho comum. Ensinou a encontrar Deus nas ocupações de cada dia." },
  { nome: "São Charbel", dataFesta: "24/07/1898", cor: VERDE, descricao: "Monge maronita do Líbano, eremita de vida escondida. Por sua intercessão o Senhor concede inúmeras curas." },
  { nome: "Santa Bernadette Soubirous", dataFesta: "16/04/1879", cor: MARROM, descricao: "Pastorinha pobre a quem Nossa Senhora apareceu em Lourdes. Guardou o segredo do céu na humildade e no silêncio." },

  // ── Brasil e devoções populares ──
  { nome: "Santo Antônio de Sant'Ana Galvão", dataFesta: "25/10/1822", cor: MARROM, descricao: "Frei Galvão, primeiro santo nascido no Brasil. Suas 'pílulas' de fé são sinal de confiança na Providência." },
  { nome: "Santa Dulce dos Pobres", dataFesta: "13/08/1992", cor: MARROM, descricao: "O 'anjo bom da Bahia', que acolheu os mais pobres dos pobres. Primeira santa nascida no Brasil, mãe dos necessitados." },
  { nome: "São Roque", dataFesta: "16/08", cor: MARROM, descricao: "Peregrino que cuidou dos doentes de peste e adoeceu por eles. Retratado com o cão fiel, é protetor dos enfermos." },
  { nome: "Santo Expedito", dataFesta: "19/04", cor: VINHO, descricao: "Mártir invocado nas causas urgentes e justas. Seu grito 'hoje!' convida a não adiar a conversão." },
  { nome: "São Cristóvão", dataFesta: "25/07", cor: MARROM, descricao: "Segundo a tradição, carregou o Menino Jesus sobre os ombros ao atravessar o rio. Padroeiro dos motoristas e viajantes." },
]

async function main() {
  const maior = await db.cardSanto.aggregate({ _max: { numero: true } })
  let numero = (maior._max.numero ?? 0) + 1

  let criados = 0
  let pulados = 0

  for (const s of SANTOS) {
    const jaExiste = await db.cardSanto.findFirst({ where: { nome: s.nome } })
    if (jaExiste) {
      console.log(`  · já existe: ${s.nome} (#${String(jaExiste.numero ?? 0).padStart(3, "0")})`)
      pulados++
      continue
    }
    await db.cardSanto.create({
      data: {
        numero,
        nome: s.nome,
        dataFesta: s.dataFesta || null,
        descricao: s.descricao,
        imagem: null,
        estilo: { ...estiloBase, bordaCor: s.cor },
      },
    })
    console.log(`  ✔ #${String(numero).padStart(3, "0")}  ${s.nome}`)
    numero++
    criados++
  }

  const total = await db.cardSanto.count()
  console.log(`\n✔ ${criados} novos Santos${pulados ? ` (${pulados} já existiam)` : ""}. Catálogo agora: ${total} cards.`)
  console.log("  Faltam as imagens → nomeie 015.jpg, 016.jpg... e rode: npx tsx scripts/anexar-imagens.ts")
}

main().catch(console.error).finally(() => db.$disconnect())
