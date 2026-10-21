import { PrismaClient, SupportProgramOutcome } from '@prisma/client'
import dayjs from 'dayjs'
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
  { name: 'Dispositif non terminé', hasLifecycle: true },
  // Without lifecycle
  { name: 'Portage de repas - pas de date', hasLifecycle: false },
  { name: 'Aide à domicile - pas de date', hasLifecycle: false },
  { name: 'Téléassistance - pas de date', hasLifecycle: false },
  { name: 'Épicerie solidaire - pas de date', hasLifecycle: false }
] as const

type SupportProgramNameLabel = (typeof supportProgramNameInputs)[number]['name']

const exitReasonNames = [
  'Objectifs atteints',
  'Déménagement',
  'Abandon du bénéficiaire',
  'Réorientation vers un autre dispositif',
  'Reprise d’emploi',
  'Fin de droits'
] as const

type ExitReasonName = (typeof exitReasonNames)[number]

type SupportProgramInput = {
  beneficiary: FixtureBeneficiary
  name: SupportProgramNameLabel
  startDate?: string
  endDate?: string
  outcome?: SupportProgramOutcome
  // Only for support programs with lifecycle
  exitReason?: ExitReasonName
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

// Date of the given day in the previous month, as YYYY-MM-DD
const lastMonth = (day: number) =>
  dayjs().subtract(1, 'month').date(day).format('YYYY-MM-DD')

// Date of the given day in the current month, as YYYY-MM-DD
const thisMonth = (day: number) => dayjs().date(day).format('YYYY-MM-DD')

// Fixed dates between 2024-01-01 and 2026-08-31, plus a few dates in the
// previous and current months to test the "Le mois dernier" and "Ce mois-ci"
// period filters.
// Support programs without lifecycle have no dates.
const supportProgramInputs: SupportProgramInput[] = [
  // COURSOR: 4 support programs
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'RSA - Accompagnement socio-professionnel',
    startDate: '2024-01-15',
    endDate: '2025-03-31',
    outcome: Achieved,
    exitReason: 'Reprise d’emploi',
    partners: [CAF26, FranceTravail]
  },
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'Accompagnement budgétaire',
    startDate: '2024-04-02',
    endDate: '2024-10-15',
    outcome: PartiallyAchieved,
    exitReason: 'Abandon du bénéficiaire'
  },
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'Parcours emploi compétences',
    startDate: '2025-05-05',
    partners: [FranceTravail]
  },
  {
    beneficiary: FixtureBeneficiary.COURSOR,
    name: 'Portage de repas - pas de date'
  },

  // WONFAR: 3 support programs, twice in the same one
  {
    beneficiary: FixtureBeneficiary.WONFAR,
    name: 'Accompagnement budgétaire',
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    outcome: NotAchieved,
    exitReason: 'Abandon du bénéficiaire'
  },
  {
    beneficiary: FixtureBeneficiary.WONFAR,
    name: 'Accompagnement budgétaire',
    startDate: '2025-01-06',
    endDate: '2025-09-30',
    outcome: Achieved,
    exitReason: 'Objectifs atteints'
  },
  {
    beneficiary: FixtureBeneficiary.WONFAR,
    name: 'Dossier de surendettement',
    startDate: '2025-02-10',
    partners: [MairieValence]
  },

  // PISCOPO: 3 support programs
  {
    beneficiary: FixtureBeneficiary.PISCOPO,
    name: 'Contrat d’engagement jeune',
    startDate: '2024-09-02',
    endDate: '2025-09-01',
    outcome: Exceeded,
    exitReason: 'Reprise d’emploi',
    partners: [FranceTravail]
  },
  {
    beneficiary: FixtureBeneficiary.PISCOPO,
    name: 'Accompagnement numérique',
    startDate: '2026-03-16'
  },
  // Started and ended last month
  {
    beneficiary: FixtureBeneficiary.PISCOPO,
    name: 'Accompagnement santé',
    startDate: lastMonth(3),
    endDate: lastMonth(24),
    outcome: PartiallyAchieved,
    exitReason: 'Réorientation vers un autre dispositif'
  },

  // APFELMANN: 2 support programs
  {
    beneficiary: FixtureBeneficiary.APFELMANN,
    name: 'Aide à domicile - pas de date'
  },
  // Started in 2024, ended last month
  {
    beneficiary: FixtureBeneficiary.APFELMANN,
    name: 'Fonds de solidarité logement',
    startDate: '2024-10-07',
    endDate: lastMonth(20),
    outcome: Achieved,
    exitReason: 'Objectifs atteints',
    partners: [CAF26]
  },

  // PENBERTHY: 4 support programs
  {
    beneficiary: FixtureBeneficiary.PENBERTHY,
    name: 'Fonds de solidarité logement',
    startDate: '2024-03-11',
    endDate: '2024-05-31',
    outcome: Achieved,
    exitReason: 'Fin de droits',
    partners: [CAF26]
  },
  {
    beneficiary: FixtureBeneficiary.PENBERTHY,
    name: 'Accompagnement vers et dans le logement',
    startDate: '2024-06-03',
    endDate: '2025-12-19',
    outcome: SubjectToConditions,
    exitReason: 'Déménagement',
    partners: [MairieValence, V0ATDQuartMonde]
  },
  {
    beneficiary: FixtureBeneficiary.PENBERTHY,
    name: 'Téléassistance - pas de date'
  },
  // Started and ended this month
  {
    beneficiary: FixtureBeneficiary.PENBERTHY,
    name: 'Soutien à la parentalité',
    startDate: thisMonth(1),
    endDate: thisMonth(22),
    outcome: SubjectToConditions
  },

  // DOWNER: 3 support programs
  {
    beneficiary: FixtureBeneficiary.DOWNER,
    name: 'Dispositif non terminé',
    startDate: '2025-09-08',
    endDate: dayjs().add(3, 'months').format('YYYY-MM-DD'), // in three months
    outcome: Achieved
  },
  {
    beneficiary: FixtureBeneficiary.DOWNER,
    name: 'Épicerie solidaire - pas de date'
  },
  // Started this month, still ongoing
  {
    beneficiary: FixtureBeneficiary.DOWNER,
    name: 'Accompagnement numérique',
    startDate: thisMonth(2)
  },

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
  {
    beneficiary: FixtureBeneficiary.TESSON,
    name: 'Épicerie solidaire - pas de date'
  },

  // MAILLARD: 3 support programs
  {
    beneficiary: FixtureBeneficiary.MAILLARD,
    name: 'Mesure d’accompagnement social personnalisé',
    startDate: '2024-07-01',
    endDate: '2026-01-30',
    outcome: NotAchieved,
    exitReason: 'Déménagement'
  },
  {
    beneficiary: FixtureBeneficiary.MAILLARD,
    name: 'Dossier de surendettement',
    startDate: '2026-04-14',
    partners: [MairieValence]
  },
  // Started in January 2026, ended this month
  {
    beneficiary: FixtureBeneficiary.MAILLARD,
    name: 'Chantier d’insertion',
    startDate: '2026-01-12',
    endDate: thisMonth(16),
    outcome: Achieved,
    exitReason: 'Objectifs atteints',
    partners: [FranceTravail]
  },

  // FERRAND: 2 support programs
  {
    beneficiary: FixtureBeneficiary.FERRAND,
    name: 'Contrat d’engagement jeune',
    startDate: '2026-01-05'
  },
  // Started last month, still ongoing
  {
    beneficiary: FixtureBeneficiary.FERRAND,
    name: 'Accompagnement budgétaire',
    startDate: lastMonth(5)
  },

  // DUBOIS: 3 support programs
  {
    beneficiary: FixtureBeneficiary.DUBOIS,
    name: 'Accompagnement santé',
    startDate: '2024-05-21',
    endDate: '2024-12-20',
    outcome: Exceeded,
    exitReason: 'Objectifs atteints'
  },
  {
    beneficiary: FixtureBeneficiary.DUBOIS,
    name: 'Accompagnement numérique',
    startDate: '2025-03-03',
    endDate: '2025-04-28',
    outcome: Achieved,
    partners: [MairieValence]
  },
  {
    beneficiary: FixtureBeneficiary.DUBOIS,
    name: 'Portage de repas - pas de date'
  }
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

    // Support programs referencing them were deleted in cascade above
    await tx.supportProgramExitReason.deleteMany({ where: { structureId } })
    const exitReasons = await tx.supportProgramExitReason.createManyAndReturn({
      data: exitReasonNames.map(name => ({ name, structureId, createdById }))
    })
    const exitReasonIds = new Map(exitReasons.map(({ id, name }) => [name, id]))

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
          exitReasonId: input.exitReason
            ? exitReasonIds.get(input.exitReason)
            : null,
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
    `${supportProgramNameInputs.length} support program names, ${exitReasonNames.length} exit reasons and ${supportProgramInputs.length} support programs created`
  )
}

main()
  .catch(e => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prismaClient.$disconnect())
