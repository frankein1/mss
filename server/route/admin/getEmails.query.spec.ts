import { describe, expect, beforeEach, afterEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'

const emailIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  emailIds.push(result.id)
  return result
}

beforeEach(async () => {
  track(
    await prismaClient.email.create({
      data: {
        from: 'test@mss.gouv.fr',
        to: 'recipient-test@yopmail.com',
        subject: 'Test email subject',
        text: 'Test email text',
        html: '<p>Test email html</p>',
        status: 'Sent'
      }
    })
  )
})

afterEach(async () => {
  if (emailIds.length) {
    await prismaClient.email.deleteMany({
      where: { id: { in: emailIds } }
    })
    emailIds.length = 0
  }
})

describe('Emails - Get Emails - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.getEmails({
        page: 1,
        perPage: 10,
        filters: {},
        orderBy: {}
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Emails - Get Emails - Results', () => {
  test('Administrator can retrieve paginated emails', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getEmails({
      page: 1,
      perPage: 10,
      filters: {},
      orderBy: {}
    })

    expect(result.emails).toBeDefined()
    expect(Array.isArray(result.emails)).toBe(true)
    expect(result.emails.length).toBeGreaterThan(0)
    expect(typeof result.totalPages).toBe('number')
  })

  test('Administrator can search emails by recipient', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getEmails({
      page: 1,
      perPage: 10,
      search: 'recipient-test',
      filters: {},
      orderBy: {}
    })

    expect(result.emails.length).toBeGreaterThan(0)
    result.emails.forEach(email => {
      expect(email.to.toLowerCase()).toContain('recipient-test')
    })
  })

  test('Administrator can filter emails by status', async ({ trpc }) => {
    const result = await trpc.administrator.admin.getEmails({
      page: 1,
      perPage: 10,
      filters: { status: 'Sent' },
      orderBy: {}
    })

    expect(result.emails.length).toBeGreaterThan(0)
    result.emails.forEach(email => {
      expect(email.status).toBe('Sent')
    })
  })
})
