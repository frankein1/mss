import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import { fixturesUsers, FixtureUserRole } from '~~/prisma/fixtures'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import dayjs from 'dayjs'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    app: { baseURL: '/' },
    public: { email: { from: 'mss@example.com' } },
    document: { useS3Storage: true }
  })
})

const adminUserId = fixturesUsers[FixtureUserRole.Administrator].id
const adminEmail = fixturesUsers[FixtureUserRole.Administrator].email

beforeEach(async () => {
  await prismaClient.user.update({
    where: { id: adminUserId },
    data: { authorizationCode: null, authorizationCodeValidity: null }
  })
})

afterEach(async () => {
  await prismaClient.email.deleteMany({
    where: {
      subject: {
        contains: "code de confirmation pour un transfert d'utilisateur"
      }
    }
  })
  await prismaClient.userActivity.deleteMany({
    where: { key: 'admin.user.authorize-user-transfer' }
  })
  await prismaClient.user.update({
    where: { id: adminUserId },
    data: { authorizationCode: null, authorizationCodeValidity: null }
  })
})

describe('Admin - Send Transfer Confirmation Code - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.authorizeUserTransfer()
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Send Transfer Confirmation Code - Happy path', () => {
  test('An administrator can request a confirmation code emailed to themselves', async ({
    trpc
  }) => {
    await trpc.administrator.admin.authorizeUserTransfer()

    const admin = await prismaClient.user.findUniqueOrThrow({
      where: { id: adminUserId }
    })
    expect(admin.authorizationCode).toEqual(expect.any(String))
    expect(admin.authorizationCode?.length).toBeGreaterThan(0)
    expect(admin.authorizationCodeValidity).not.toBeNull()
    const validityMs = admin.authorizationCodeValidity!.getTime()
    const nowMs = Date.now()
    expect(validityMs).toBeGreaterThan(nowMs)
    expect(validityMs).toBeLessThanOrEqual(
      dayjs().add(11, 'minutes').toDate().getTime()
    )

    const emails = await prismaClient.email.findMany({
      where: {
        to: adminEmail,
        subject: {
          contains: "code de confirmation pour un transfert d'utilisateur"
        }
      }
    })
    expect(emails).toHaveLength(1)
    expect(emails[0]?.text).toContain(admin.authorizationCode)
  })
})
