import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'

const createdIds: string[] = []

beforeEach(async () => {
  const email = await prismaClient.email.create({
    data: {
      from: 'test@test.com',
      to: 'recipient@test.com',
      subject: 'Test email',
      text: 'Test text',
      html: '<p>Test</p>',
      status: 'Error'
    }
  })
  createdIds.push(email.id)
})

afterEach(async () => {
  if (createdIds.length) {
    await prismaClient.email.deleteMany({
      where: { id: { in: createdIds } }
    })
    createdIds.length = 0
  }
})

describe('Admin - Send Email - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.sendEmail({ id: createdIds[0]! })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Send Email - Happy path', () => {
  test('An administrator can change email status to ToSend', async ({
    trpc
  }) => {
    const result = await trpc.administrator.admin.sendEmail({
      id: createdIds[0]!
    })

    expect(result.email.status).toBe('ToSend')

    const email = await prismaClient.email.findUniqueOrThrow({
      where: { id: createdIds[0]! }
    })
    expect(email.status).toBe('ToSend')
  })
})
