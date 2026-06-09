import { test as setup } from '@playwright/test'
import type { BrowserContext } from '@playwright/test'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { signJwt } from '~/server/lib/jwt'
import { minutesToMillis } from '~/utils/time'

async function setAuthenticationToken(
  context: BrowserContext,
  user: { id: string }
) {
  if (!process.env.NUXT_AUTH_JWT_KEY) {
    throw new Error('Missing NUXT_AUTH_JWT_KEY')
  }
  const token = signJwt(user, process.env.NUXT_AUTH_JWT_KEY, 60)

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

function setPayloadUser(role: FixtureUserRole) {
  return { id: fixturesUsers[role].id }
}

setup('authenticate as Structure Manager Jeanne', async ({ context }) => {
  const managerFile = 'playwright/.auth/structure-manager.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.StructureManager)
  )
  await context.storageState({ path: managerFile })
})

setup('authenticate as Social Worker Jean', async ({ context }) => {
  const workerFile = 'playwright/.auth/social-worker.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.SocialWorker)
  )
  await context.storageState({ path: workerFile })
})

setup('authenticate as Reception Agent Jean', async ({ context }) => {
  const agentFile = 'playwright/.auth/reception-agent.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.ReceptionAgent)
  )
  await context.storageState({ path: agentFile })
})

setup('authenticate as Structure Manager Anita', async ({ context }) => {
  const managerFile = 'playwright/.auth/structure-manager-new-user.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.StructureManagerNew)
  )
  await context.storageState({ path: managerFile })
})

setup('authenticate as Social Worker Mehdi', async ({ context }) => {
  const workerFile = 'playwright/.auth/social-worker-new-user.json'

  await setAuthenticationToken(
    context,
    setPayloadUser(FixtureUserRole.SocialWorkerNew)
  )
  await context.storageState({ path: workerFile })
})

setup(
  'authenticate as Structure Manager Ministère Laura',
  async ({ context }) => {
    const managerFile = 'playwright/.auth/structure-manager-ministere.json'

    await setAuthenticationToken(
      context,
      setPayloadUser(FixtureUserRole.StructureManagerMinistere)
    )
    await context.storageState({ path: managerFile })
  }
)
