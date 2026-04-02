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
    runDry(sourceStructure, sourceUsers, sourceAccounts, sourceExternalAccounts)

    return
  }

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
}

function runDry(
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

restoreStructureUsersAccounts().finally(
  async () => await prismaClient.$disconnect()
)
