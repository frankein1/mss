import { parseArgs } from 'node:util'
import type {
  BeneficiaryMobility,
  BeneficiaryStatus,
  FileInstructionType,
  FollowupMedium,
  Gender,
  SocialSupportRedirectionType,
  SocialSupportStatus,
  SocialSupportType
} from '@prisma/client'
import { Prisma, SupportProgramOutcome } from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker'
import type { ArrayElement } from '~~/types/utils'
import { equiRandomEnum } from './fixtures/utils'
import { prismaClient } from '~~/server/prisma'

type Config = {
  // Number of structures to create. Required.
  structureCount: number
  // null => do not create users, link Jeanne Responsable to the first structure.
  usersPerStructure: number | null
  familyFilesPerStructure: number
  // null => do not create social supports.
  socialSupportsPerBeneficiary: number | null
  // null => do not create support programs. Otherwise each beneficiary gets a
  // random count in [0, supportProgramsPerBeneficiary].
  supportProgramsPerBeneficiary: number | null
  partnersPerStructure: number
  // Share of support programs linked to one or two partner organizations.
  supportProgramPartnerLinkRate: number
  // Share of lifecycle support programs that have ended (end date + outcome).
  supportProgramEndedRate: number
}

const DEFAULTS = {
  usersPerStructure: null,
  familyFilesPerStructure: 1000,
  socialSupportsPerBeneficiary: 15,
  supportProgramsPerBeneficiary: 4,
  partnersPerStructure: 5,
  supportProgramPartnerLinkRate: 0.2,
  supportProgramEndedRate: 0.6
} satisfies Omit<Config, 'structureCount'>

type SocialSupportSubjectsCreateInput = Omit<
  ArrayElement<
    NonNullable<
      Parameters<typeof prismaClient.socialSupportSubject.createMany>[0]
    >['data']
  >,
  'ownedByStructureId'
>

const ID_JEANNE_RESPONSABLE = '7e5c1734-35cb-4047-9035-a944961a67a4'

const socialSupportSubjects: SocialSupportSubjectsCreateInput[] = [
  {
    name: 'Inclusion numérique',
    default: 'InclusionNumerique',
    used: true
  },
  {
    name: 'Domiciliation',
    default: 'Domiciliation',
    used: true
  },
  {
    name: 'Aide sociale',
    default: 'AideSociale',
    used: true
  },
  {
    name: 'Aides financières non remboursables',
    used: true
  }
]

function randomStatus(): BeneficiaryStatus {
  return equiRandomEnum([
    'Archived',
    'Deceased',
    'Inactive',
    'Inactive',
    'Active'
  ])
}
function randomGender(): Gender {
  return equiRandomEnum(['Male', 'Female', 'Other'])
}
function randomMobility(): BeneficiaryMobility {
  return equiRandomEnum([
    'PermitWithVehicle',
    'PermitWithoutVehicle',
    'Code',
    'PermitPending',
    'OtherPermit',
    'PublicTransport',
    'BikeOrEquivalent',
    'InvalidPermit',
    'VehicleWithoutPermit',
    'None'
  ])
}
function randomSocialSupportType(): SocialSupportType {
  return equiRandomEnum(['Followup', 'HelpRequestHousing', 'HelpRequest'])
}
function randomMedium(): FollowupMedium {
  return equiRandomEnum([
    'PlannedInPerson',
    'UnplannedInPerson',
    'PhoneCall',
    'BeneficiaryHouseAppointment',
    'AdministrativeManagement',
    'ExternalAppointment',
    'PostalMail',
    'Email',
    'Videoconference',
    'ThirdParty',
    'Sms'
  ])
}
function randomFollowupStatus(): SocialSupportStatus {
  return equiRandomEnum(['Todo', 'InProgress', 'Done'])
}
function randomHelpRequestStatus(): SocialSupportStatus {
  return equiRandomEnum([
    'WaitingAdditionalInformation',
    'InvestigationOngoing',
    'Accepted',
    'Refused',
    'Adjourned',
    'ClosedByBeneficiary',
    'ClosedByAgent',
    'Dismissed'
  ])
}
function randomFileInstructionType(): FileInstructionType {
  return equiRandomEnum(['Financial', 'Housing', 'Other'])
}
function randomRedirection(): SocialSupportRedirectionType {
  return equiRandomEnum(['PartnerOrganization', 'Intern', 'Other'])
}

// Support program name catalog created per structure (12 with lifecycle, 4 without),
// mirroring prisma/support_program_seed.ts so both seeds tell the same story.
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

function randomSupportProgramOutcome(): SupportProgramOutcome {
  return equiRandomEnum(Object.values(SupportProgramOutcome))
}

const supportProgramExitReasonNames = [
  'Fin de prise en charge',
  'Déménagement',
  'Abandon',
  'Objectifs atteints',
  'Réorientation'
]

function randomSupportProgramLifecycle(
  hasLifecycle: boolean,
  endedRate: number,
  exitReasonIds: string[]
): {
  startDate: Date | null
  endDate: Date | null
  outcome: SupportProgramOutcome | null
  exitReasonId: string | null
} {
  if (!hasLifecycle) {
    return { startDate: null, endDate: null, outcome: null, exitReasonId: null }
  }
  const startDate = faker.date.between({ from: '2022-01-01', to: new Date() })
  if (Math.random() >= endedRate) {
    return { startDate, endDate: null, outcome: null, exitReasonId: null }
  }
  return {
    startDate,
    endDate: faker.date.between({ from: startDate, to: new Date() }),
    outcome: randomSupportProgramOutcome(),
    exitReasonId: faker.helpers.arrayElement(exitReasonIds)
  }
}

async function main(config: Config) {
  for (let i = 0; i < config.structureCount; i++) {
    console.log('starting seed', `${i}/${config.structureCount}`)
    const structure = await prismaClient.structure.create({
      select: {
        id: true,
        socialSupportSubjects: { select: { id: true, name: true } }
      },
      data: {
        type: 'Ccas',
        name: faker.company.name(),
        zipcode: faker.location.zipCode(),
        siret: '12345678901234',
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        socialSupportSubjects: { createMany: { data: socialSupportSubjects } }
      }
    })

    const partnerCount =
      config.supportProgramsPerBeneficiary !== null
        ? config.partnersPerStructure
        : 1
    const partners = await prismaClient.partnerOrganization.createManyAndReturn(
      {
        select: { id: true },
        data: new Array(partnerCount).fill(null).map(() => ({
          structureId: structure.id,
          name: faker.company.name()
        }))
      }
    )
    // Kept as the redirection target so existing behavior is unchanged
    const partner = partners[0] as { id: string }

    let users: { id: string }[] = []

    if (config.usersPerStructure === null) {
      if (i === 0) {
        console.log('Linking Jeanne Responsable to a structure...')
        await prismaClient.user.update({
          data: { structureId: structure.id },
          where: { id: ID_JEANNE_RESPONSABLE }
        })
      }
    } else {
      const data = new Array(config.usersPerStructure).fill(null).map(() => {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = `${faker.string.ulid()}${faker.internet.email({
          firstName,
          lastName,
          allowSpecialCharacters: true
        })}`
        return {
          structureId: structure.id,
          firstName,
          lastName,
          email,
          role: 'Referent' as const,
          status: 'Active' as const,
          lastAccess: faker.date.between({ from: '2022-01-01', to: new Date() })
        } satisfies Prisma.UserCreateManyInput
      })

      users = await prismaClient.user.createManyAndReturn({
        select: { id: true },
        data
      })
    }

    const families = await prismaClient.familyFile.createManyAndReturn({
      data: new Array(config.familyFilesPerStructure).fill(null).map(() => ({
        structureId: structure.id
      }))
    })

    const [_, beneficiaries, __] = await Promise.all([
      prismaClient.budget.createMany({
        data: families.map(({ id }) => ({
          familyFileId: id
        }))
      }),
      prismaClient.beneficiary.createManyAndReturn({
        select: { id: true, familyFileId: true },
        data: families.map(({ id }) => ({
          firstName: faker.person.firstName(),
          birthName: faker.person.lastName(),
          usualName: faker.person.lastName(),
          birthDate: faker.date.birthdate(),
          gender: randomGender(),
          structureId: structure.id,
          fileNumber: faker.string.ulid(),
          status: randomStatus(),
          familyFileId: id,
          zipcode: faker.location.zipCode(),
          city: faker.location.city(),
          street: faker.location.streetAddress(),
          region: faker.location.state(),
          phone1: faker.phone.number(),
          email: faker.internet.email(),
          mobility: randomMobility()
        }))
      }),
      prismaClient.user.update({
        where: { id: users[0]?.id || ID_JEANNE_RESPONSABLE },
        data: {
          referentFor: { connect: families }
        }
      })
    ])

    if (config.socialSupportsPerBeneficiary !== null) {
      // data contains familyFilesPerStructure * socialSupportsPerBeneficiary items
      const data: Prisma.SocialSupportCreateManyInput[] = beneficiaries.flatMap(
        beneficiary =>
          new Array(config.socialSupportsPerBeneficiary).fill(null).map(() => {
            const socialSupportType = randomSocialSupportType()
            const [status, subtype] =
              socialSupportType === 'Followup'
                ? [randomFollowupStatus(), randomMedium()]
                : [
                    randomHelpRequestStatus(),
                    socialSupportType === 'HelpRequestHousing'
                      ? 'Housing'
                      : undefined
                  ]
            return {
              createdById: users[0]?.id || ID_JEANNE_RESPONSABLE,
              lastUpdatedById: users[0]?.id || ID_JEANNE_RESPONSABLE,
              beneficiaryId: beneficiary.id,
              familyFileId: beneficiary.familyFileId,
              socialSupportType,
              structureId: structure.id,
              status,
              subtype,
              date: faker.date.between({ from: '2022-01-01', to: new Date() })
            }
          })
      )

      const supports = await prismaClient.socialSupport.createManyAndReturn({
        select: { id: true, socialSupportType: true },
        data
      })

      const [_, fi, __, ___] = await Promise.all([
        prismaClient.followup.createMany({
          data: supports
            .filter(s => s.socialSupportType === 'Followup')
            .map(({ id }) => ({ socialSupportId: id, medium: randomMedium() }))
        }),
        prismaClient.fileInstruction.createManyAndReturn({
          select: { id: true, type: true },
          data: supports
            .filter(s => s.socialSupportType !== 'Followup')
            .map(({ id }) => ({
              socialSupportId: id,
              externalStructure: false,
              type: randomFileInstructionType()
            }))
        }),
        prismaClient.socialSupportRedirection.createMany({
          data: supports.map(({ id }) => {
            const type = randomRedirection()
            return {
              socialSupportId: id,
              type,
              ...(type === 'PartnerOrganization' && {
                partnerOrganizationId: partner.id
              })
            }
          })
        }),
        prismaClient.socialSupportSubject.update({
          select: { id: true },
          where: {
            id: structure.socialSupportSubjects[0]?.id as string
          },
          data: {
            socialSupports: { connect: supports.map(s => ({ id: s.id })) }
          }
        })
      ])

      await Promise.all([
        prismaClient.helpRequest.createMany({
          data: fi
            .filter(f => f.type !== 'Housing')
            .map(({ id, type }) => ({
              subjectId: structure.socialSupportSubjects[0]?.id as string,
              financialSupport: type === 'Financial',
              fileInstructionId: id
            }))
        }),
        prismaClient.housingHelpRequest.createMany({
          data: fi
            .filter(f => f.type === 'Housing')
            .map(({ id }) => ({ fileInstructionId: id }))
        })
      ])
    }

    if (config.supportProgramsPerBeneficiary !== null) {
      const createdById = users[0]?.id || ID_JEANNE_RESPONSABLE

      const supportProgramNames =
        await prismaClient.supportProgramName.createManyAndReturn({
          select: { id: true, hasLifecycle: true },
          data: supportProgramNameInputs.map(input => ({
            ...input,
            structureId: structure.id,
            createdById
          }))
        })

      const exitReasons =
        await prismaClient.supportProgramExitReason.createManyAndReturn({
          select: { id: true },
          data: supportProgramExitReasonNames.map(name => ({
            name,
            structureId: structure.id,
            createdById
          }))
        })
      const exitReasonIds = exitReasons.map(r => r.id)

      // Build the support program rows, remembering which partners each should
      // be linked to (the M2M relation cannot be set through createMany).
      const programData: Prisma.SupportProgramCreateManyInput[] = []
      const programPartnerIds: string[][] = []

      for (const beneficiary of beneficiaries) {
        const programCount = faker.number.int({
          min: 0,
          max: config.supportProgramsPerBeneficiary
        })
        for (let p = 0; p < programCount; p++) {
          const name = faker.helpers.arrayElement(supportProgramNames)
          programData.push({
            beneficiaryId: beneficiary.id,
            supportProgramNameId: name.id,
            ...randomSupportProgramLifecycle(
              name.hasLifecycle,
              config.supportProgramEndedRate,
              exitReasonIds
            )
          })
          programPartnerIds.push(
            Math.random() < config.supportProgramPartnerLinkRate
              ? faker.helpers
                  .arrayElements(partners, { min: 1, max: 2 })
                  .map(pp => pp.id)
              : []
          )
        }
      }

      if (programData.length) {
        const programs = await prismaClient.supportProgram.createManyAndReturn({
          select: { id: true },
          data: programData
        })

        // Bulk-insert the partner <-> support program join rows
        const links: { a: string; b: string }[] = []
        programs.forEach((program, idx) => {
          for (const partnerId of programPartnerIds[idx] ?? []) {
            links.push({ a: partnerId, b: program.id })
          }
        })

        const JOIN_CHUNK = 1000
        for (let c = 0; c < links.length; c += JOIN_CHUNK) {
          const values = Prisma.join(
            links
              .slice(c, c + JOIN_CHUNK)
              .map(l => Prisma.sql`(${l.a}::uuid, ${l.b}::uuid)`)
          )
          await prismaClient.$executeRaw`
            INSERT INTO "_partner_organization_to_support_program" ("A", "B")
            VALUES ${values}
          `
        }
      }
    }
  }
}

const HELP = `Usage: tsx --tsconfig prisma/tsconfig.json prisma/large_seed.ts --structures <n> [options]

Seeds the database with a large, randomised dataset.

Required:
  --structures <n>                             Number of structures (integer >= 1)

Options (defaults in brackets; "none" skips the related entities):
  --users-per-structure <n|none>               Users per structure [none => link Jeanne Responsable]
  --families-per-structure <n>                 Family files per structure [${DEFAULTS.familyFilesPerStructure}]
  --social-supports-per-beneficiary <n|none>   Social supports per beneficiary [${DEFAULTS.socialSupportsPerBeneficiary}]
  --support-programs-per-beneficiary <n|none>  Max support programs per beneficiary [${DEFAULTS.supportProgramsPerBeneficiary}]
  --partners-per-structure <n>                 Partner organizations per structure [${DEFAULTS.partnersPerStructure}]
  --support-program-partner-link-rate <r>      Share of programs linked to partners, 0..1 [${DEFAULTS.supportProgramPartnerLinkRate}]
  --support-program-ended-rate <r>             Share of lifecycle programs ended, 0..1 [${DEFAULTS.supportProgramEndedRate}]
  -h, --help                                   Show this help and exit
`

const cliOptions = {
  'help': { type: 'boolean', short: 'h' },
  'structures': { type: 'string' },
  'users-per-structure': { type: 'string' },
  'families-per-structure': { type: 'string' },
  'social-supports-per-beneficiary': { type: 'string' },
  'support-programs-per-beneficiary': { type: 'string' },
  'partners-per-structure': { type: 'string' },
  'support-program-partner-link-rate': { type: 'string' },
  'support-program-ended-rate': { type: 'string' }
} as const

// Shape of parseArgs values for cliOptions: every value flag is a string, help
// is a boolean, all optional.
type CliValues = { help?: boolean } & {
  [K in Exclude<keyof typeof cliOptions, 'help'>]?: string
}

// Parse an integer flag, throwing on anything that is not an integer >= min.
function parseIntFlag(flag: string, raw: string, min: number): number {
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min) {
    throw new Error(`--${flag} must be an integer >= ${min}, got "${raw}"`)
  }
  return value
}

// Parse a nullable count flag: "none" => null, undefined => fallback, otherwise
// an integer >= 0.
function parseNullableIntFlag(
  flag: string,
  raw: string | undefined,
  fallback: number | null
): number | null {
  if (raw === undefined) {
    return fallback
  }
  if (raw === 'none') {
    return null
  }
  return parseIntFlag(flag, raw, 0)
}

// Parse a rate flag in [0, 1], throwing otherwise; undefined => fallback.
function parseRateFlag(
  flag: string,
  raw: string | undefined,
  fallback: number
): number {
  if (raw === undefined) {
    return fallback
  }
  const value = Number(raw)
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`--${flag} must be a number between 0 and 1, got "${raw}"`)
  }
  return value
}

function buildConfig(values: CliValues): Config {
  if (values.structures === undefined) {
    throw new Error('--structures is required')
  }
  return {
    structureCount: parseIntFlag('structures', values.structures, 1),
    usersPerStructure: parseNullableIntFlag(
      'users-per-structure',
      values['users-per-structure'],
      DEFAULTS.usersPerStructure
    ),
    familyFilesPerStructure:
      values['families-per-structure'] === undefined
        ? DEFAULTS.familyFilesPerStructure
        : parseIntFlag(
            'families-per-structure',
            values['families-per-structure'],
            0
          ),
    socialSupportsPerBeneficiary: parseNullableIntFlag(
      'social-supports-per-beneficiary',
      values['social-supports-per-beneficiary'],
      DEFAULTS.socialSupportsPerBeneficiary
    ),
    supportProgramsPerBeneficiary: parseNullableIntFlag(
      'support-programs-per-beneficiary',
      values['support-programs-per-beneficiary'],
      DEFAULTS.supportProgramsPerBeneficiary
    ),
    partnersPerStructure:
      values['partners-per-structure'] === undefined
        ? DEFAULTS.partnersPerStructure
        : parseIntFlag(
            'partners-per-structure',
            values['partners-per-structure'],
            1
          ),
    supportProgramPartnerLinkRate: parseRateFlag(
      'support-program-partner-link-rate',
      values['support-program-partner-link-rate'],
      DEFAULTS.supportProgramPartnerLinkRate
    ),
    supportProgramEndedRate: parseRateFlag(
      'support-program-ended-rate',
      values['support-program-ended-rate'],
      DEFAULTS.supportProgramEndedRate
    )
  }
}

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

async function bootstrap() {
  const argv = process.argv.slice(2)

  // A bare invocation has nothing to run, so it shows usage (exit 0).
  if (argv.length === 0) {
    console.log(HELP)
    process.exit(0)
  }

  let values: CliValues
  try {
    ;({ values } = parseArgs({ args: argv, options: cliOptions }))
  } catch (error) {
    // Unknown/malformed flags from parseArgs itself.
    fail((error as Error).message)
  }

  if (values.help) {
    console.log(HELP)
    process.exit(0)
  }

  let config: Config
  try {
    config = buildConfig(values)
  } catch (error) {
    fail((error as Error).message)
  }

  await main(config)
}

bootstrap()
;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, async () => {
    await prismaClient.$disconnect()
    process.exit(1)
  })
)
