import { prismaClient } from '~/server/prisma'
import { parseArgs, createSourceClient, validateStructure } from './utils'
import { mapStructureUpdate, readStructure } from './db/structure'
import { mapUserUpdate, readUsers } from './db/users'
import { mapAccountCreate, readAccounts } from './db/accounts'
import {
  mapExternalAccountCreate,
  readExternalAccounts
} from './db/external-accounts'

async function restoreStructureUsersAccounts() {
  const { structureId, dryRun } = parseArgs()
  const source = await createSourceClient()

  console.log(
    `restore-structure: structure and user restoration for structure ${structureId} - dry-run ${dryRun}`
  )

  await validateStructure(source, structureId)

  const sourceStructure = await readStructure(source, structureId)
  const sourceUsers = await readUsers(source, structureId)
  const sourceAccounts = await readAccounts(source, sourceUsers)
  const sourceExternalAccounts = await readExternalAccounts(source, sourceUsers)

  if (dryRun) {
    runDryStructureUsersAccounts(
      sourceStructure,
      sourceUsers,
      sourceAccounts,
      sourceExternalAccounts
    )

    return
  }

  const start = performance.now()
  await prismaClient.$transaction([
    prismaClient.structure.update({
      where: { id: structureId },
      data: mapStructureUpdate(sourceStructure)
    }),
    ...sourceUsers.map(u =>
      prismaClient.user.update({
        where: { id: u.id },
        data: mapUserUpdate(u)
      })
    ),
    prismaClient.account.createMany({
      data: sourceAccounts.map(mapAccountCreate),
      skipDuplicates: true
    }),
    prismaClient.externalAccount.createMany({
      data: sourceExternalAccounts.map(mapExternalAccountCreate),
      skipDuplicates: true
    })
  ])

  console.log(
    `restore-structure: structure and user restoration done in ${(performance.now() - start) / 1000}s`
  )
}

async function restoreBeneficiariesSupports() {
  const { structureId, dryRun } = parseArgs()
  const source = await createSourceClient()

  console.log(
    `restore-structure: beneficiary and social support restoration for structure ${structureId} - dry-run ${dryRun}`
  )

  await validateStructure(source, structureId)

  const sourceBeneficiaries = await readBeneficiaries(source, structureId)
  const sourceSocialSupports = await readSocialSupports(source, structureId)
  const sourceFollowups = await readFollowups(source, structureId)
  const sourceFileInstructions = await readFileInstructions(source, structureId)
  const sourceHelpRequests = await readHelpRequests(source, structureId)
  const sourceHousingHelpRequests = await readHousingHelpRequests(
    source,
    structureId
  )

  if (dryRun) {
    runDryBeneficiariesSupports(
      sourceBeneficiaries,
      sourceSocialSupports,
      sourceFollowups,
      sourceFileInstructions,
      sourceHelpRequests,
      sourceHousingHelpRequests
    )

    return
  }

  const start = performance.now()
  console.log(
    `restore-structure: beneficiary and social support restoration done in ${(performance.now() - start) / 1000}s`
  )
}

function runDryStructureUsersAccounts(
  sourceStructure: { name: string },
  sourceUsers: any[],
  sourceAccounts: any[],
  sourceExternalAccounts: any[]
) {
  console.log('restore-structure: DRY RUN - no changes applied')
  console.log(
    `restore-structure: would update structure: "${sourceStructure.name}"`
  )
  console.log(`restore-structure: would update ${sourceUsers.length} users`)
  console.log(
    `restore-structure: would update ${sourceAccounts.length} accounts`
  )
  console.log(
    `restore-structure: would update ${sourceExternalAccounts.length} accounts`
  )
}

function runDryBeneficiariesSupports(
  sourceBeneficiaries: any[],
  sourceSocialSupports: any[],
  sourceFollowups: any[],
  sourceFileInstructions: any[],
  sourceHelpRequests: any[],
  sourceHousingHelpRequests: any[]
) {
  console.log('restore-structure: DRY RUN - no changes applied')
  console.log(
    `restore-structure: would update ${sourceBeneficiaries.length} beneficiaries`
  )
  console.log(
    `restore-structure: would update ${sourceSocialSupports.length} social supports`
  )
  console.log(
    `restore-structure: would update ${sourceFollowups.length} followups`
  )
  console.log(
    `restore-structure: would update ${sourceFileInstructions.length} file instructions`
  )
  console.log(
    `restore-structure: would update ${sourceHelpRequests.length} help requests`
  )
  console.log(
    `restore-structure: would update ${sourceHousingHelpRequests.length} housing help requests`
  )

  // TODO redirections
}

// WARNING ! Cannot have two of them uncommented since they would be launched in //
restoreStructureUsersAccounts().finally(cleanup)
//restoreBeneficiariesSupports().finally(cleanup)

async function cleanup() {
  await prismaClient.$disconnect()
}
