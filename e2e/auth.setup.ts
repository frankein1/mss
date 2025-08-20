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

function setPayloadUser(
  role: FixtureUserRole,
  struct: FixtureStructure,
  withCGUValidated = true
) {
  const user = fixturesUsers[role]
  const structure = fixtureStructures[struct]
  const CGUHistoryVersion =
    role === FixtureUserRole.StructureManagerNew ||
    role === FixtureUserRole.SocialWorkerNew
      ? null
      : fixturesCGUHistory[
          role === FixtureUserRole.StructureManagerMinistere ? 6 : role
        ]?.version || null

  if (withCGUValidated && !CGUHistoryVersion) {
    throw new Error('cgu: missing data')
  }

  return {
    ...user,
    structureId: structure.id,
    structureType: structure.type,
    CGUHistoryVersion
  }
}

setup('authenticate as Structure Manager Jeanne', async ({ context }) => {
  const managerFile = 'playwright/.auth/structure-manager.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.StructureManager, FixtureStructure.Test)
  )
  await context.storageState({ path: managerFile })
})

setup('authenticate as Social Worker Jean', async ({ context }) => {
  const workerFile = 'playwright/.auth/social-worker.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.SocialWorker, FixtureStructure.Test)
  )
  await context.storageState({ path: workerFile })
})

setup('authenticate as Reception Agent Jean', async ({ context }) => {
  const agentFile = 'playwright/.auth/reception-agent.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.ReceptionAgent, FixtureStructure.Test)
  )
  await context.storageState({ path: agentFile })
})

setup('authenticate as Structure Manager Anita', async ({ context }) => {
  const managerFile = 'playwright/.auth/structure-manager-new-user.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(
      FixtureUserRole.StructureManagerNew,
      FixtureStructure.Autun,
      false
    )
  )
  await context.storageState({ path: managerFile })
})

setup('authenticate as Social Worker Mehdi', async ({ context }) => {
  const workerFile = 'playwright/.auth/social-worker-new-user.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(
      FixtureUserRole.SocialWorkerNew,
      FixtureStructure.Autun,
      false
    )
  )
  await context.storageState({ path: workerFile })
})

setup(
  'authenticate as Structure Manager Ministère Laura',
  async ({ context }) => {
    const managerFile = 'playwright/.auth/structure-manager-ministere.json'

    await setAuthenticationToken(
      context,
      setPayloadUser(
        FixtureUserRole.StructureManagerMinistere,
        FixtureStructure.Ministère
      )
    )
    await context.storageState({ path: managerFile })
  }
)
