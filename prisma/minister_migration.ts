import { PrismaClient, Minister } from '@prisma/client'

const prismaClient = new PrismaClient()

const ministerMap = {
  FrancoisBraun: {
    firstName: 'François',
    lastName: 'Braun',
    function: 'Santé et Prévention',
    former: false
  },
  AgnesFirminLeBodo: {
    firstName: 'Agnès',
    lastName: 'Firmin-Le Bodo',
    function: 'Ministre déléguée',
    former: false
  },
  JeanChristopheCombe: {
    firstName: 'Jean-Christophe',
    lastName: 'Combe',
    function: 'Solidarités, Autonomie et Personnes handicapées',
    former: false
  },
  GenevieveDarrieussecq: {
    firstName: 'Geneviève',
    lastName: 'Darrieussecq',
    function: 'Personnes handicapées',
    former: true
  },
  GenevieveDarrieussecqBarnier1: {
    firstName: 'Geneviève',
    lastName: 'Darrieussecq',
    function: 'Ministre de la Santé et de l’Accès aux soins',
    former: false
  },
  OlivierDussopt: {
    firstName: 'Olivier',
    lastName: 'Dussopt',
    function: 'Travail, Plein emploi et Insertion',
    former: false
  },
  CaroleGrandjean: {
    firstName: 'Carole',
    lastName: 'Grandjean',
    function: 'Enseignement, Formation professionnels',
    former: false
  },
  AurelienRousseau: {
    firstName: 'Aurélien',
    lastName: 'Aurélien',
    function: 'Santé et Prévention',
    former: false
  },
  AuroreBerge: {
    firstName: 'Aurore',
    lastName: 'Bergé',
    function: 'Solidarités et Familles',
    former: false
  },
  FadilaKhattabi: {
    firstName: 'Fadila',
    lastName: 'Khattabi',
    function: 'Personnes handicapées',
    former: false
  },
  CatherineVautrin: {
    firstName: 'Catherine',
    lastName: 'Vautrin',
    function: 'Travail, Santé et Solidarités',
    former: false
  },
  FredericValletoux: {
    firstName: 'Frédéric',
    lastName: 'Valletoux',
    function: 'Délégué Santé et Prévention',
    former: false
  },
  SarahElHairy: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Déléguée Enfance, Jeunesse et Familles',
    former: false
  },
  AstridPanosyanBouvet: {
    firstName: 'Astrid',
    lastName: 'Panosyan-Bouvet',
    function: 'Ministre du Travail et de l’Emploi',
    former: false
  },
  PaulChristophe: {
    firstName: 'Paul',
    lastName: 'Christophe',
    function:
      'Ministre des Solidarités, de l’Autonomie et de l’Égalité entre les femmes et les hommes',
    former: false
  },
  AgnesCanayer: {
    firstName: 'Agnès',
    lastName: 'Canayer',
    function:
      'Ministre déléguée, chargée de la Famille et de la Petite Enfance',
    former: false
  },
  SalimaSaa: {
    firstName: 'Salima',
    lastName: 'Saa',
    function:
      "Secrétaire d'État, chargée de l'Égalité entre les femmes et les hommes",
    former: false
  },
  CharlotteParmentierLecocq: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function:
      'Ministre déléguée, chargée des Personnes en situation de handicap',
    former: false
  },
  CatherineVautrinBayrou1: {
    firstName: 'Catherine',
    lastName: 'Vautrin',
    function:
      'Ministre du Travail, de la Santé, des Solidarités et des Familles',
    government: 'Bayrou 1',
    former: false
  },
  AstridPanosyanBouvetBayrou1: {
    firstName: 'Astrid',
    lastName: 'Panosyan-Bouvet',
    function: "Ministre chargée du Travail et de l'Emploi",
    government: 'Bayrou 1',
    former: false
  },
  YannickNeuder: {
    firstName: 'Yannick',
    lastName: 'Neuder',
    function: "Ministre chargé de la Santé et de l'Accès aux soins",
    former: false
  },
  CharlotteParmentierLecocqBayrou1: {
    firstName: 'Charlotte',
    lastName: 'Parmentier-Lecocq',
    function: 'Ministre chargée de l’Autonomie et du Handicap',
    government: 'Bayrou 1',
    former: false
  },
  SarahElHairyBayrou1: {
    firstName: 'Sarah',
    lastName: 'El Haïry',
    function: 'Haut-commissaire à l’enfance',
    government: 'Bayrou 1',
    former: false
  },
  JeanPierreFarandou: {
    firstName: 'Jean-Pierre',
    lastName: 'Farandou',
    function: 'Ministre du Travail et des Solidarités',
    former: false
  },
  StephanieRist: {
    firstName: 'Stephanie',
    lastName: 'Rist',
    function:
      'Ministre de la Santé, des Familles, de l’Autonomie et des Personnes handicapées',
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
  // 1. Create ministers using Minister Enum
  console.log('⏱️ Creating ministers...')

  const mappingMinisters = await Promise.all(
    Object.values(Minister).map(async minister => {
      try {
        const res = await prismaClient.ministerEntity.create({
          data: ministerMap[minister],
          select: { id: true }
        })

        return {
          id: res.id,
          oldMinisterName: minister
        }
      } catch (error) {
        console.error(`❌ Failed to create minister: ${minister}`, error)
      }
    })
  )
  console.log(
    `✅ ${mappingMinisters.length} ministers created on ${Object.values(Minister).length} ministers in Enum`
  )

  // 2. Update minister in Social Supports
  console.log('⏱️ Updating minister in Social Supports...')

  const socialSupports = await prismaClient.socialSupport.findMany({
    where: {
      AND: [{ ministerId: null }, { ministre: { not: null } }]
    },
    select: {
      id: true,
      ministre: true
    }
  })

  let socialSupportsUpdated = 0
  for (const socialSupport of socialSupports) {
    try {
      const minister = mappingMinisters.find(
        m => m?.oldMinisterName === socialSupport.ministre
      )
      if (minister) {
        await prismaClient.socialSupport.update({
          where: { id: socialSupport.id },
          data: { ministerId: minister.id }
        })
        socialSupportsUpdated++
      }
    } catch (error) {
      console.error(
        `❌ Failed to update SocialSupport ${socialSupport.id}`,
        error
      )
    }
  }

  console.log(
    `✅ ${socialSupportsUpdated} social supports updated on ${socialSupports.length} initial social supports`
  )
}

main()
