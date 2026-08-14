import { describe, expect, afterEach } from 'vitest'
import { prismaClient } from '~~/server/prisma'
import { test } from '~~/test/server/test-utils'
import { fakerFR as faker } from '@faker-js/faker'

const createdPartnerIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  createdPartnerIds.push(result.id)
  return result
}

const createInput = () => ({
  dataSource: 'Custom' as const,
  name: `PCM-${faker.company.name()}`,
  siret: '12345678901234'
})

afterEach(async () => {
  if (createdPartnerIds.length) {
    await prismaClient.partnerOrganization.deleteMany({
      where: { id: { in: createdPartnerIds } }
    })
    createdPartnerIds.length = 0
  }
})

describe('PartnerOrganization - Create - Authorizations', () => {
  test('A manager can create a partner organization', async ({ trpc }) => {
    const result = track(
      await trpc.structureManager.partner.create(createInput())
    )

    expect(result.id).toEqual(expect.any(String))
  })

  test('A social worker can create a partner organization', async ({
    trpc
  }) => {
    const result = track(await trpc.socialWorker.partner.create(createInput()))

    expect(result.id).toEqual(expect.any(String))
  })

  test('A referent cannot create a partner organization', async ({ trpc }) => {
    await expect(() =>
      trpc.referent.partner.create(createInput())
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An instructor cannot create a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.instructor.partner.create(createInput())
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A reception agent cannot create a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.receptionAgent.partner.create(createInput())
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('An administrator cannot create a partner organization', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.partner.create(createInput())
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})

describe('PartnerOrganization - Create - Contacts', () => {
  test('A manager can create a partner organization with contacts', async ({
    trpc
  }) => {
    const contacts = [
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: '01 23 45 67 89'
      }
    ]

    const result = track(
      await trpc.structureManager.partner.create({
        ...createInput(),
        contacts
      })
    )

    const persisted = await prismaClient.partnerOrganizationContact.findMany({
      where: { partnerId: result.id },
      select: { name: true, email: true, phone: true }
    })

    expect(persisted).toHaveLength(1)
    expect(persisted[0]).toMatchObject({
      name: contacts[0]!.name,
      email: contacts[0]!.email,
      phone: contacts[0]!.phone
    })
  })
})
