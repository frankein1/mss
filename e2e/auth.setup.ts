import { test as setup } from '@playwright/test'
import type { BrowserContext } from '@playwright/test'
import { StructureType, UserRole, UserStatus } from '@prisma/client'
import {
  fixturesCGUHistory,
  FixtureStructure,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { signJwt } from '~/server/lib/jwt'
import { minutesToMillis } from '~/utils/time'

async function setAuthenticationToken(
  context: BrowserContext,
  user: {
    firstName: string
    lastName: string
    email: string
    id: string
    role: UserRole
    status: UserStatus
    CGUHistoryVersion: string | null
    structureId: string
    structureType: StructureType
  }
) {
  const token = signJwt(
    user,
    process.env.AUTH_JWT_KEY || 'secretJWT',
    parseInt(process.env.TOKEN_VALIDATION_IN_MINUTES || '30')
  )

  const expires = parseInt(
    ((new Date().getTime() + minutesToMillis(30)) / 1000).toFixed(0)
  )
  await context.addCookies([
    {
      name: 'MSS_SESSION_TOKEN',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: true,
      expires
    }
  ])
}

setup('authenticate as Structure Manager Jeanne', async ({ context }) => {
  const managerFile = 'playwright/.auth/structure-manager.json'

  const user = fixturesUsers[FixtureUserRole.StructureManager]
  const CGUHistoryVersion =
    fixturesCGUHistory[FixtureUserRole.StructureManager].version
  const structure = fixtureStructures[FixtureStructure.Test]
  await setAuthenticationToken(context, {
    ...user,
    structureId: structure.id,
    structureType: structure.type,
    CGUHistoryVersion
  })
  await context.storageState({ path: managerFile })
})

setup('authenticate as Social Worker Jean', async ({ context }) => {
  const workerFile = 'playwright/.auth/social-worker.json'

  const user = fixturesUsers[FixtureUserRole.SocialWorker]
  const CGUHistoryVersion =
    fixturesCGUHistory[FixtureUserRole.SocialWorker].version
  const structure = fixtureStructures[FixtureStructure.Test]
  await setAuthenticationToken(context, {
    ...user,
    structureId: structure.id,
    structureType: structure.type,
    CGUHistoryVersion
  })
  await context.storageState({ path: workerFile })
})

setup('authenticate as Reception Agent Jean', async ({ context }) => {
  const agentFile = 'playwright/.auth/reception-agent.json'

  const user = fixturesUsers[FixtureUserRole.ReceptionAgent]
  const CGUHistoryVersion =
    fixturesCGUHistory[FixtureUserRole.ReceptionAgent].version
  const structure = fixtureStructures[FixtureStructure.Test]
  await setAuthenticationToken(context, {
    ...user,
    structureId: structure.id,
    structureType: structure.type,
    CGUHistoryVersion
  })
  await context.storageState({ path: agentFile })
})

setup('authenticate as Structure Manager Anita', async ({ context }) => {
  const managerFile = 'playwright/.auth/structure-manager-new-user.json'

  const user = fixturesUsers[FixtureUserRole.StructureManagerNew]
  const structure = fixtureStructures[FixtureStructure.Autun]
  await setAuthenticationToken(context, {
    ...user,
    structureId: structure.id,
    structureType: structure.type,
    CGUHistoryVersion: null
  })
  await context.storageState({ path: managerFile })
})

setup('authenticate as Social Worker Mehdi', async ({ context }) => {
  const workerFile = 'playwright/.auth/social-worker-new-user.json'

  const user = fixturesUsers[FixtureUserRole.SocialWorkerNew]
  const structure = fixtureStructures[FixtureStructure.Autun]
  await setAuthenticationToken(context, {
    ...user,
    structureId: structure.id,
    structureType: structure.type,
    CGUHistoryVersion: null
  })
  await context.storageState({ path: workerFile })
})

setup(
  'authenticate as Structure Manager Ministère Laura',
  async ({ context }) => {
    const managerFile = 'playwright/.auth/structure-manager-ministere.json'

    const user = fixturesUsers[FixtureUserRole.StructureManagerMinistere]
    const CGUHistoryVersion = fixturesCGUHistory[6].version
    const structure = fixtureStructures[FixtureStructure.Ministère]
    await setAuthenticationToken(context, {
      ...user,
      structureId: structure.id,
      structureType: structure.type,
      CGUHistoryVersion
    })
    await context.storageState({ path: managerFile })
  }
)
