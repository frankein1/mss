import { describe, test, expect, vi, afterEach } from 'vitest'
import { prismaClient } from '~~/server/prisma/prismaClient'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'
import { createSession } from '~~/server/lib/session'
import type { H3Event } from 'h3'
import { setUser } from '@sentry/node'
import handler from '~~/server/middleware/setContext'

vi.mock('@sentry/node', () => ({
  setUser: vi.fn()
}))

const userId = fixturesUsers[FixtureUserRole.SocialWorker].id

function createMockEvent(cookie?: string) {
  return {
    node: {
      req: {
        headers: cookie ? { cookie } : {}
      },
      res: {
        setHeader: vi.fn(),
        getHeader: vi.fn(() => [])
      }
    },
    context: {}
  } as unknown as H3Event
}

const sessionIds: string[] = []

afterEach(async () => {
  if (sessionIds.length) {
    await prismaClient.authSession.deleteMany({
      where: { id: { in: sessionIds } }
    })
    sessionIds.length = 0
  }
  vi.mocked(setUser).mockClear()
})

describe('SetContext - Session Lookup', () => {
  test('a valid session token populates event.context.auth', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    const event = createMockEvent(`MSS_SESSION_TOKEN=${token}`)
    await handler(event)

    expect(event.context.auth).toEqual({ userId })
    expect(setUser).toHaveBeenCalledWith({ id: userId })
  })

  test('an expired session is rejected and the cookie is cleared', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    await prismaClient.authSession.update({
      where: { id: sessionId },
      data: { expiresAt: new Date(Date.now() - 1_000) }
    })

    const event = createMockEvent(`MSS_SESSION_TOKEN=${token}`)
    await handler(event)

    expect(event.context.auth).toBeUndefined()
    expect(setUser).toHaveBeenCalledWith(null)

    sessionIds.length = 0
  })

  test('no cookie sets context to unauthenticated', async () => {
    const event = createMockEvent()
    await handler(event)

    expect(event.context.auth).toBeUndefined()
    expect(setUser).toHaveBeenCalledWith(null)
  })

  test('an unknown token is rejected and the cookie is cleared', async () => {
    const event = createMockEvent('MSS_SESSION_TOKEN=unknown-token')
    await handler(event)

    expect(event.context.auth).toBeUndefined()
    expect(setUser).toHaveBeenCalledWith(null)
  })
})
