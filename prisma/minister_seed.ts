import { PrismaClient, Minister, MinisterStatus } from '@prisma/client'

const prismaClient = new PrismaClient()

const ministerMap = {
  FrancoisBraun: {
    firstName: 'François',
    lastName: 'Braun',
    function: 'Santé et Prévention',
    former: true,
    government: 'non renseigné'
  },
  AgnesFirminLeBodo: {
    firstName: 'Agnès',
    lastName: 'Firmin-Le Bodo',
    function: 'Santé et Prévention',
    former: true,
    government: 'non renseigné'
  },
  JeanChristopheCombe: {
    firstName: 'Jean-Christophe',
    lastName: 'Combe',
    function: 'Solidarités, Autonomie et Personnes handicapées',
    ministry: 'Solidarités, Autonomie et Personnes handicapées',
    former: true,
    government: 'non renseigné'
  },
  GenevieveDarrieussecq: {
    firstName: 'Geneviève',
    lastName: 'Darrieussecq',
    function: 'Personnes handicapées',
    former: true,
    government: 'non renseigné'
  },
  GenevieveDarrieussecqBarnier1: {
    firstName: 'Geneviève',
    lastName: 'Darrieussecq',
    function: 'Ministre de la Santé et de l’Accès aux soins',
    government: 'Barnier 1',
    former: true
  },
  OlivierDussopt: {
    firstName: 'Olivier',
    lastName: 'Dussopt',
    function: 'Travail, Plein emploi et Insertion',
    former: true,
    government: 'non renseigné'
  },
  CaroleGrandjean: {
    firstName: 'Carole',
    lastName: 'Grandjean',
    function: 'Enseignement, Formation professionnels',
    former: true,
    government: 'non renseigné'
  },
  AurelienRousseau: {
    firstName: 'Aurélien',
    lastName: 'Rousseau',
    function: 'Santé et Prévention',
    former: true,
    government: 'non renseigné'
  },
  AuroreBerge: {
    firstName: 'Aurore',
    lastName: 'Bergé',
    function: 'Solidarités et Familles',
    former: true,
    government: 'non renseigné'
  },
  FadilaKhattabi: {
    firstName: 'Fadila',
    lastName: 'Khattabi',
    function: 'Personnes handicapées',
    former: true,
    government: 'non renseigné'
  },
  CatherineVautrin: {
    firstName: 'Catherine',
    lastName: 'Vautrin',
    function: 'Travail, Santé et Solidarités',
    former: true,
    government: 'non renseigné'
  },
  FredericValletoux: {
    firstName: 'Frédéric',
    lastName: 'Valletoux',
    function: 'Délégué Santé et Prévention',
    former: true,
    government: 'non renseigné'
  },
  SarahElHairy: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Déléguée Enfance, Jeunesse et Familles',
    former: true,
    government: 'non renseigné'
  },
  AstridPanosyanBouvet: {
    firstName: 'Astrid',
    lastName: 'Panosyan-Bouvet',
    function: 'Ministre du Travail et de l’Emploi',
    former: true,
    government: 'non renseigné'
  },
  PaulChristophe: {
    firstName: 'Paul',
    lastName: 'Christophe',
    function:
      'Ministre des Solidarités, de l’Autonomie et de l’Égalité entre les femmes et les hommes',
    ministry:
      'Ministère des Solidarités, de l’Autonomie et de l’Égalité entre les femmes et les hommes',
    former: true,
    government: 'non renseigné'
  },
  AgnesCanayer: {
    firstName: 'Agnès',
    lastName: 'Canayer',
    function:
      'Ministre déléguée, chargée de la Famille et de la Petite Enfance',
    ministry: 'Ministère de la Famille et de la Petite Enfance',
    former: true,
    government: 'non renseigné'
  },
  SalimaSaa: {
    firstName: 'Salima',
    lastName: 'Saa',
    function:
      "Secrétaire d'État, chargée de l'Égalité entre les femmes et les hommes",
    former: true,
    government: 'non renseigné'
  },
  CharlotteParmentierLecocq: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function:
      'Ministre déléguée, chargée des Personnes en situation de handicap',
    former: true,
    government: 'non renseigné'
  },
  CatherineVautrinBayrou1: {
    firstName: 'Catherine',
    lastName: 'Vautrin',
    function:
      'Ministre du Travail, de la Santé, des Solidarités et des Familles',
    government: 'Bayrou',
    former: true
  },
  AstridPanosyanBouvetBayrou1: {
    firstName: 'Astrid',
    lastName: 'Panosyan-Bouvet',
    function: "Ministre chargée du Travail et de l'Emploi",
    government: 'Bayrou',
    former: true
  },
  YannickNeuder: {
    firstName: 'Yannick',
    lastName: 'Neuder',
    function: "Ministre chargé de la Santé et de l'Accès aux soins",
    government: 'Bayrou',
    former: true
  },
  CharlotteParmentierLecocqBayrou1: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function: 'Ministre chargée de l’Autonomie et du Handicap',
    government: 'Bayrou',
    former: true
  },
  SarahElHairyBayrou1: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Haut-commissaire à l’enfance',
    government: 'Bayrou',
    former: true
  },
  JeanPierreFarandou: {
    firstName: 'Jean-Pierre',
    lastName: 'Farandou',
    function: 'Ministre du Travail et des Solidarités',
    government: 'Lecornu',
    former: false
  },
  StephanieRist: {
    firstName: 'Stephanie',
    lastName: 'Rist',
    function:
      'Ministre de la Santé, des Familles, de l’Autonomie et des Personnes handicapées',
    government: 'Lecornu',
    former: false
  },
  CharlotteParmentierLecornu2: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecornu',
    function:
      'Ministre déléguée, chargée de l’Autonomie et des Personnes handicapées',
    government: 'Lecornu',
    former: false
  },
  SarahElHairyLecornu2: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Haut-commissaire à l’enfance',
    government: 'Lecornu',
    former: false
  }
}

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
            status: ministerMap[minister].former
              ? MinisterStatus.Former
              : MinisterStatus.Current
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
