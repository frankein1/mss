import {
  PrismaClient,
  Minister,
  MinisterStatus,
  type Prisma
} from '@prisma/client'

const prismaClient = new PrismaClient()

const ministerMap = {
  FrancoisBraun: {
    firstName: 'François',
    lastName: 'Braun',
    function: 'Santé et Prévention',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'FrancoisBraun'
  },
  AgnesFirminLeBodo: {
    firstName: 'Agnès',
    lastName: 'Firmin-Le Bodo',
    function: 'Santé et Prévention',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'AgnesFirminLeBodo'
  },
  JeanChristopheCombe: {
    firstName: 'Jean-Christophe',
    lastName: 'Combe',
    function: 'Solidarités, Autonomie et Personnes handicapées',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'JeanChristopheCombe'
  },
  GenevieveDarrieussecq: {
    firstName: 'Geneviève',
    lastName: 'Darrieussecq',
    function: 'Personnes handicapées',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'GenevieveDarrieussecq'
  },
  GenevieveDarrieussecqBarnier1: {
    firstName: 'Geneviève',
    lastName: 'Darrieussecq',
    function: 'Ministre de la Santé et de l’Accès aux soins',
    government: 'Barnier1',
    status: MinisterStatus.Former,
    oldMinister: 'GenevieveDarrieussecqBarnier1'
  },
  OlivierDussopt: {
    firstName: 'Olivier',
    lastName: 'Dussopt',
    function: 'Travail, Plein emploi et Insertion',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'OlivierDussopt'
  },
  CaroleGrandjean: {
    firstName: 'Carole',
    lastName: 'Grandjean',
    function: 'Enseignement, Formation professionnels',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'CaroleGrandjean'
  },
  AurelienRousseau: {
    firstName: 'Aurélien',
    lastName: 'Rousseau',
    function: 'Santé et Prévention',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'AurelienRousseau'
  },
  AuroreBerge: {
    firstName: 'Aurore',
    lastName: 'Bergé',
    function: 'Solidarités et Familles',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'AuroreBerge'
  },
  FadilaKhattabi: {
    firstName: 'Fadila',
    lastName: 'Khattabi',
    function: 'Personnes handicapées',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'FadilaKhattabi'
  },
  CatherineVautrin: {
    firstName: 'Catherine',
    lastName: 'Vautrin',
    function: 'Travail, Santé et Solidarités',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'CatherineVautrin'
  },
  FredericValletoux: {
    firstName: 'Frédéric',
    lastName: 'Valletoux',
    function: 'Délégué Santé et Prévention',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'FredericValletoux'
  },
  SarahElHairy: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Déléguée Enfance, Jeunesse et Familles',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'SarahElHairy'
  },
  AstridPanosyanBouvet: {
    firstName: 'Astrid',
    lastName: 'Panosyan-Bouvet',
    function: 'Ministre du Travail et de l’Emploi',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'AstridPanosyanBouvet'
  },
  PaulChristophe: {
    firstName: 'Paul',
    lastName: 'Christophe',
    function:
      'Ministre des Solidarités, de l’Autonomie et de l’Égalité entre les femmes et les hommes',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'PaulChristophe'
  },
  AgnesCanayer: {
    firstName: 'Agnès',
    lastName: 'Canayer',
    function:
      'Ministre déléguée, chargée de la Famille et de la Petite Enfance',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'AgnesCanayer'
  },
  SalimaSaa: {
    firstName: 'Salima',
    lastName: 'Saa',
    function:
      "Secrétaire d'État, chargée de l'Égalité entre les femmes et les hommes",
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'SalimaSaa'
  },
  CharlotteParmentierLecocq: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function:
      'Ministre déléguée, chargée des Personnes en situation de handicap',
    status: MinisterStatus.Former,
    government: 'non renseigné',
    oldMinister: 'CharlotteParmentierLecocq'
  },
  CatherineVautrinBayrou1: {
    firstName: 'Catherine',
    lastName: 'Vautrin',
    function:
      'Ministre du Travail, de la Santé, des Solidarités et des Familles',
    government: 'Bayrou1',
    status: MinisterStatus.Former,
    oldMinister: 'CatherineVautrinBayrou1'
  },
  AstridPanosyanBouvetBayrou1: {
    firstName: 'Astrid',
    lastName: 'Panosyan-Bouvet',
    function: "Ministre chargée du Travail et de l'Emploi",
    government: 'Bayrou1',
    status: MinisterStatus.Former,
    oldMinister: 'AstridPanosyanBouvetBayrou1'
  },
  YannickNeuder: {
    firstName: 'Yannick',
    lastName: 'Neuder',
    function: "Ministre chargé de la Santé et de l'Accès aux soins",
    government: 'Bayrou1',
    status: MinisterStatus.Former,
    oldMinister: 'YannickNeuder'
  },
  CharlotteParmentierLecocqBayrou1: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function: 'Ministre chargée de l’Autonomie et du Handicap',
    government: 'Bayrou1',
    status: MinisterStatus.Former,
    oldMinister: 'CharlotteParmentierLecocqBayrou1'
  },
  SarahElHairyBayrou1: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Haut-commissaire à l’enfance',
    government: 'Bayrou1',
    status: MinisterStatus.Former,
    oldMinister: 'SarahElHairyBayrou1'
  },
  JeanPierreFarandou: {
    firstName: 'Jean-Pierre',
    lastName: 'Farandou',
    function: 'Ministre du Travail et des Solidarités',
    government: 'Lecornu',
    status: MinisterStatus.Former,
    oldMinister: 'JeanPierreFarandou'
  },
  StephanieRist: {
    firstName: 'Stephanie',
    lastName: 'Rist',
    function:
      'Ministre de la Santé, des Familles, de l’Autonomie et des Personnes handicapées',
    government: 'Lecornu',
    status: MinisterStatus.Current,
    oldMinister: 'StephanieRist'
  },
  CharlotteParmentierLecornu2: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function:
      'Ministre déléguée, chargée de l’Autonomie et des Personnes handicapées',
    government: 'Lecornu',
    status: MinisterStatus.Current,
    oldMinister: 'CharlotteParmentierLecornu2'
  },
  SarahElHairyLecornu2: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Haut-commissaire à l’enfance',
    government: 'Lecornu',
    status: MinisterStatus.Current,
    oldMinister: 'SarahElHairyLecornu2'
  }
} satisfies Record<string, Prisma.MinisterEntityCreateInput>

const main = async () => {
  console.log('⏱️ Creating ministers...')

  // Create ministers using Minister Enum
  const mappingMinisters = await Promise.all(
    Object.values(Minister).map(async minister => {
      try {
        const res = await prismaClient.ministerEntity.create({
          data: {
            firstName: ministerMap[minister].firstName,
            lastName: ministerMap[minister].lastName,
            function: ministerMap[minister].function,
            government: ministerMap[minister].government,
            status: ministerMap[minister].status,
            oldMinister: ministerMap[minister].oldMinister
          },
          select: { id: true }
        })

        return {
          id: res.id
        }
      } catch (error) {
        console.error(`❌ Failed to create minister: ${minister}`, error)
      }
    })
  )
  console.log(
    `✅ ${mappingMinisters.length} ministers created on ${Object.values(Minister).length} ministers in Enum`
  )
}

main()
