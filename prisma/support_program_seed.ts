import { PrismaClient, SupportProgramOutcome } from '@prisma/client'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  FixturePartnerOrganization,
  fixturesPartnerOrganizations,
  FixtureStructure,
  fixtureStructures,
  FixtureUserRole,
  fixturesUsers
} from './fixtures'

/**
 * Replaces the support programs of the test structure with a fixed data set,
 * useful to check the support program statistics.
 *
 * Run with: npx tsx --tsconfig .nuxt/tsconfig.server.json prisma/support_program_seed.ts
 */

const prismaClient = new PrismaClient()

const structureId = fixtureStructures[FixtureStructure.Test].id
const createdById = fixturesUsers[FixtureUserRole.StructureManager].id

const supportProgramNameInputs = [
  // With lifecycle (start date, end date, outcome)
  { name: 'RSA - Accompagnement socio-professionnel', hasLifecycle: true },
  { name: 'Contrat d’engagement jeune', hasLifecycle: true },
  { name: 'Accompagnement budgétaire', hasLifecycle: true },
  { name: 'Fonds de solidarité logement', hasLifecycle: true },
  { name: 'Accompagnement vers et dans le logement', hasLifecycle: true },
  { name: 'Parcours emploi compétences', hasLifecycle: true },
  { name: 'Mesure d’accompagnement social personnalisé', hasLifecycle: true },
  { name: 'Accompagnement santé', hasLifecycle: true },
  { name: 'Dossier de surendettement', hasLifecycle: true },
  { name: 'Soutien à la parentalité', hasLifecycle: true },
  { name: 'Chantier d’insertion', hasLifecycle: true },
  { name: 'Accompagnement numérique', hasLifecycle: true },
  // Without lifecycle
  { name: 'Portage de repas', hasLifecycle: false },
  { name: 'Aide à domicile', hasLifecycle: false },
  { name: 'Téléassistance', hasLifecycle: false },
  { name: 'Épicerie solidaire', hasLifecycle: false }
] as const

type SupportProgramNameLabel = (typeof supportProgramNameInputs)[number]['name']

type SupportProgramInput = {
  beneficiary: FixtureBeneficiary
  name: SupportProgramNameLabel
  startDate?: string
  endDate?: string
  outcome?: SupportProgramOutcome
  partners?: FixturePartnerOrganization[]
}

const { CAF26, FranceTravail, MairieValence, V0ATDQuartMonde } =
  FixturePartnerOrganization
const {
  NotAchieved,
  PartiallyAchieved,
  SubjectToConditions,
  Achieved,
  Exceeded
} = SupportProgramOutcome

// Dates between 2024-01-01 and 2026-08-31.
// Support programs without lifecycle have no dates.
const supportProgramInputs: SupportProgramInput[] = [
  // COURSOR: 4 support programs
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'RSA - Accompagnement socio-professionnel',
    startDate: '2024-01-15',
    endDate: '2025-03-31',
    outcome: Achieved,
    partners: [CAF26, FranceTravail]
  },
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'Accompagnement budgétaire',
    startDate: '2024-04-02',
    endDate: '2024-10-15',
    outcome: PartiallyAchieved
  },
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'Parcours emploi compétences',
    startDate: '2025-05-05',
    partners: [FranceTravail]
  },
  { beneficiary: FixtureBeneficiary.COURSOR, name: 'Portage de repas' },

  // WONFAR: 3 support programs, twice in the same one
  {
    beneficiary: FixtureBeneficiary.WONFAR,
    name: 'Accompagnement budgétaire',
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    outcome: NotAchieved
  },
  {
    beneficiary: FixtureBeneficiary.WONFAR,
    name: 'Accompagnement budgétaire',
    startDate: '2025-01-06',
    endDate: '2025-09-30',
    outcome: Achieved
  },
  {
    beneficiary: FixtureBeneficiary.WONFAR,
    name: 'Dossier de surendettement',
    startDate: '2025-02-10',
    partners: [MairieValence]
  },

  // PISCOPO: 2 support programs
  {
    beneficiary: FixtureBeneficiary.PISCOPO,
    name: 'Contrat d’engagement jeune',
    startDate: '2024-09-02',
    endDate: '2025-09-01',
    outcome: Exceeded,
    partners: [FranceTravail]
  },
  {
    beneficiary: FixtureBeneficiary.PISCOPO,
    name: 'Accompagnement numérique',
    startDate: '2026-03-16'
  },

  // APFELMANN: 1 support program
  { beneficiary: FixtureBeneficiary.APFELMANN, name: 'Aide à domicile' },

  // PENBERTHY: 3 support programs
  {
    beneficiary: FixtureBeneficiary.PENBERTHY,
    name: 'Fonds de solidarité logement',
    startDate: '2024-03-11',
    endDate: '2024-05-31',
    outcome: Achieved,
    partners: [CAF26]
  },
  {
    beneficiary: FixtureBeneficiary.PENBERTHY,
    name: 'Accompagnement vers et dans le logement',
    startDate: '2024-06-03',
    endDate: '2025-12-19',
    outcome: SubjectToConditions,
    partners: [MairieValence, V0ATDQuartMonde]
  },
  { beneficiary: FixtureBeneficiary.PENBERTHY, name: 'Téléassistance' },

  // DOWNER: 2 support programs
  {
    beneficiary: FixtureBeneficiary.DOWNER,
    name: 'Soutien à la parentalité',
    startDate: '2025-09-08',
    endDate: '2026-06-26',
    outcome: Achieved
  },
  { beneficiary: FixtureBeneficiary.DOWNER, name: 'Épicerie solidaire' },

  // TESSON: 4 support programs
  {
    beneficiary: FixtureBeneficiary.TESSON,
    name: 'RSA - Accompagnement socio-professionnel',
    startDate: '2024-11-04',
    partners: [CAF26]
  },
  {
    beneficiary: FixtureBeneficiary.TESSON,
    name: 'Chantier d’insertion',
    startDate: '2025-01-13',
    endDate: '2025-07-11',
    outcome: PartiallyAchieved,
    partners: [V0ATDQuartMonde]
  },
  {
    beneficiary: FixtureBeneficiary.TESSON,
    name: 'Accompagnement santé',
    startDate: '2026-02-02'
  },
  { beneficiary: FixtureBeneficiary.TESSON, name: 'Épicerie solidaire' },

  // MAILLARD: 2 support programs
  {
    beneficiary: FixtureBeneficiary.MAILLARD,
    name: 'Mesure d’accompagnement social personnalisé',
    startDate: '2024-07-01',
    endDate: '2026-01-30',
    outcome: NotAchieved
  },
  {
    beneficiary: FixtureBeneficiary.MAILLARD,
    name: 'Dossier de surendettement',
    startDate: '2026-04-14',
    partners: [MairieValence]
  },

  // FERRAND: 1 support program
  {
    beneficiary: FixtureBeneficiary.FERRAND,
    name: 'Contrat d’engagement jeune',
    startDate: '2026-01-05'
  },

  // DUBOIS: 3 support programs
  {
    beneficiary: FixtureBeneficiary.DUBOIS,
    name: 'Accompagnement santé',
    startDate: '2024-05-21',
    endDate: '2024-12-20',
    outcome: Exceeded
  },
  {
    beneficiary: FixtureBeneficiary.DUBOIS,
    name: 'Accompagnement numérique',
    startDate: '2025-03-03',
    endDate: '2025-04-28',
    outcome: Achieved,
    partners: [MairieValence]
  },
  { beneficiary: FixtureBeneficiary.DUBOIS, name: 'Portage de repas' }
]

async function main() {
  console.log('starting support program seed')

  await prismaClient.$transaction(async tx => {
    // Support programs are deleted in cascade
    const { count } = await tx.supportProgramName.deleteMany({
      where: { structureId }
    })
    console.log(`${count} support program names deleted`)

    const supportProgramNames = await tx.supportProgramName.createManyAndReturn(
      {
        data: supportProgramNameInputs.map(input => ({
          ...input,
          structureId,
          createdById
        }))
      }
    )
    const supportProgramNameIds = new Map(
      supportProgramNames.map(({ id, name }) => [name, id])
    )

    for (const input of supportProgramInputs) {
      const supportProgramNameId = supportProgramNameIds.get(input.name)
      const beneficiary = fixturesBeneficiaries[input.beneficiary]
      if (!supportProgramNameId || !beneficiary) {
        throw new Error(`support program seed: missing data for ${input.name}`)
      }

      await tx.supportProgram.create({
        data: {
          beneficiaryId: beneficiary.id,
          supportProgramNameId,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          outcome: input.outcome ?? null,
          partnerOrganisations: {
            connect: (input.partners ?? []).map(partner => ({
              id: fixturesPartnerOrganizations[partner].id
            }))
          }
        }
      })
    }
  })

  console.log(
    `${supportProgramNameInputs.length} support program names and ${supportProgramInputs.length} support programs created`
  )
}

main()
  .catch(e => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prismaClient.$disconnect())
