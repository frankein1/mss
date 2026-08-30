import { describe, test, expect, afterEach } from 'vitest'
import { prismaClient } from '~~/server/prisma/prismaClient'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'
import { createSession, validateSession, deleteSession } from './session'

const userId = fixturesUsers[FixtureUserRole.SocialWorker].id

const sessionIds: string[] = []

afterEach(async () => {
  if (sessionIds.length) {
    await prismaClient.authSession.deleteMany({
      where: { id: { in: sessionIds } }
    })
    sessionIds.length = 0
  }
})

describe('Session - Create', () => {
  test('createSession returns a token and persists a hashed row', async () => {
    const result = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(result.sessionId)

    expect(result).toEqual({
      sessionId: expect.any(String),
      token: expect.any(String)
    })

    const row = await prismaClient.authSession.findUnique({
      where: { id: result.sessionId },
      omit: { tokenHash: false }
    })

    expect(row).toMatchObject({
      id: result.sessionId,
      userId,
      userAgent: 'vitest'
    })
    expect(row!.tokenHash).toEqual(expect.any(String))
    expect(row!.tokenHash).not.toBe(result.token)

    const expectedExpiry = new Date(Date.now() + 60 * 60_000)
    expect(
      Math.abs(row!.expiresAt.getTime() - expectedExpiry.getTime())
    ).toBeLessThan(5_000)
  })
})

describe('Session - Validate', () => {
  test('a valid token returns the session and user id', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })

    expect(result).toMatchObject({
      sessionId,
      userId
    })
  })

  test('an unknown token returns null', async () => {
    const result = await validateSession('nonexistent-token', {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })

    expect(result).toBeNull()
  })
})

describe('Session - Validate - Sliding expiry', () => {
  test('extends expiresAt when less than 30 minutes remain', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    // Move expiresAt to 20 minutes from now (< 30-min threshold)
    const soonExpiry = new Date(Date.now() + 20 * 60_000)
    await prismaClient.authSession.update({
      where: { id: sessionId },
      data: { expiresAt: soonExpiry }
    })

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })
    expect(result).not.toBeNull()

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId },
      select: { expiresAt: true }
    })

    const expectedExpiry = new Date(Date.now() + 60 * 60_000)
    expect(
      Math.abs(row!.expiresAt.getTime() - expectedExpiry.getTime())
    ).toBeLessThan(5_000)
  })

  test('does not extend when more than 30 minutes remain (throttle)', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    const originalRow = await prismaClient.authSession.findUnique({
      where: { id: sessionId },
      select: { expiresAt: true }
    })
    const originalExpiry = originalRow!.expiresAt

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })
    expect(result).not.toBeNull()

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId },
      select: { expiresAt: true }
    })

    expect(row!.expiresAt.getTime()).toBe(originalExpiry.getTime())
  })

  test('sliding expiry is capped by absolute max', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    // Move createdAt to 3h50m ago so absolute max (4h) is only 10 min away
    const createdAt = new Date(Date.now() - (3 * 60 + 50) * 60_000)
    const soonExpiry = new Date(Date.now() + 5 * 60_000)
    await prismaClient.authSession.update({
      where: { id: sessionId },
      data: { createdAt, expiresAt: soonExpiry }
    })

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })
    expect(result).not.toBeNull()

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId },
      select: { expiresAt: true }
    })

    const absoluteDeadline = new Date(createdAt.getTime() + 240 * 60_000)
    expect(
      Math.abs(row!.expiresAt.getTime() - absoluteDeadline.getTime())
    ).toBeLessThan(5_000)
  })

  test('skips DB write when expiresAt is already at the absolute deadline', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    // Place createdAt 3h40m ago; set expiresAt exactly at the absolute deadline (createdAt + 4h)
    const createdAt = new Date(Date.now() - (3 * 60 + 40) * 60_000)
    const absoluteDeadline = new Date(createdAt.getTime() + 240 * 60_000)
    await prismaClient.authSession.update({
      where: { id: sessionId },
      data: { createdAt, expiresAt: absoluteDeadline }
    })

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })
    expect(result).not.toBeNull()

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId },
      select: { expiresAt: true }
    })

    expect(row!.expiresAt.getTime()).toBe(absoluteDeadline.getTime())
  })
})

describe('Session - Validate - Expiry', () => {
  test('lazy-deletes an idle-expired session', async () => {
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

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })

    expect(result).toBeNull()

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId }
    })
    expect(row).toBeNull()

    // Already deleted — don't try to clean up again
    sessionIds.length = 0
  })

  test('lazy-deletes a session past its absolute max', async () => {
    const { sessionId, token } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    // createdAt 5 hours ago, expiresAt still in the future (sliding was generous)
    const createdAt = new Date(Date.now() - 5 * 60 * 60_000)
    await prismaClient.authSession.update({
      where: { id: sessionId },
      data: { createdAt, expiresAt: new Date(Date.now() + 30 * 60_000) }
    })

    const result = await validateSession(token, {
      slidingExpiryMinutes: 60,
      absoluteMaxMinutes: 240
    })

    expect(result).toBeNull()

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId }
    })
    expect(row).toBeNull()

    sessionIds.length = 0
  })
})

describe('Session - Delete', () => {
  test('deleteSession removes the row', async () => {
    const { sessionId } = await createSession({
      userId,
      userAgent: 'vitest',
      slidingExpiryMinutes: 60
    })
    sessionIds.push(sessionId)

    await deleteSession(sessionId)

    const row = await prismaClient.authSession.findUnique({
      where: { id: sessionId }
    })
    expect(row).toBeNull()

    sessionIds.length = 0
  })

  test('deleteSession is idempotent for unknown ids', async () => {
    await expect(
      deleteSession('00000000-0000-0000-0000-000000000000')
    ).resolves.not.toThrow()
  })
})
