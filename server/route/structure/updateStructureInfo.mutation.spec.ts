import { describe, expect, beforeEach, afterEach } from 'vitest'
import { test, createCaller } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'

const PREFIX = 'SUSI-'

let structureId: string
let managerCaller: ReturnType<typeof createCaller>
let socialWorkerCaller: ReturnType<typeof createCaller>
const userIds: string[] = []

beforeEach(async () => {
  const structure = await prismaClient.structure.create({
    data: {
      name: `${PREFIX}Structure`,
      type: 'Ccas',
      address: '1 rue Test',
      city: 'Testville',
      zipcode: '00000',
      phone: '01 00 00 00 00',
      email: `${PREFIX}structure@test.com`
    }
  })
  structureId = structure.id

  const structureCtx = {
    id: structure.id,
    type: 'Ccas' as const,
    externalRdvspActive: null
  }

  const manager = await prismaClient.user.create({
    data: {
      firstName: `${PREFIX}Manager`,
      lastName: `${PREFIX}Test`,
      email: `${PREFIX}manager@test.com`,
      role: 'StructureManager',
      status: 'Active',
      structureId: structure.id
    }
  })
  userIds.push(manager.id)

  managerCaller = createCaller({
    id: manager.id,
    role: 'StructureManager',
    status: 'Active',
    structureId: structure.id,
    structure: structureCtx
  })

  const socialWorker = await prismaClient.user.create({
    data: {
      firstName: `${PREFIX}Worker`,
      lastName: `${PREFIX}Test`,
      email: `${PREFIX}worker@test.com`,
      role: 'SocialWorker',
      status: 'Active',
      structureId: structure.id
    }
  })
  userIds.push(socialWorker.id)

  socialWorkerCaller = createCaller({
    id: socialWorker.id,
    role: 'SocialWorker',
    status: 'Active',
    structureId: structure.id,
    structure: structureCtx
  })
})

afterEach(async () => {
  if (userIds.length) {
    await prismaClient.userActivity.deleteMany({
      where: { userId: { in: userIds } }
    })
    userIds.length = 0
  }
  await prismaClient.user.deleteMany({
    where: { email: { startsWith: PREFIX } }
  })
  await prismaClient.structure.deleteMany({
    where: { name: { startsWith: PREFIX } }
  })
})

const input = {
  name: `${PREFIX}Updated Name`,
  email: `${PREFIX}updated@test.com`,
  address: '42 rue du Test',
  city: `${PREFIX}Testville`,
  zipcode: '75001',
  phone: '01 23 45 67 89',
  dpoFirstName: 'Jean',
  dpoLastName: 'DPO',
  dpoEmail: 'dpo@test.com'
}

describe('Structure - Update Info - Authorizations', () => {
  test('A StructureManager can update structure info', async () => {
    const result = await managerCaller.structure.updateStructureInfo(input)
    expect(result.id).toBe(structureId)
  })

  test('A SocialWorker cannot update structure info', async () => {
    await expect(() =>
      socialWorkerCaller.structure.updateStructureInfo(input)
    ).rejects.toThrow(/not allowed to access route/i)
  })
})

describe('Structure - Update Info - Data', () => {
  test('Happy path updates structure fields', async () => {
    await managerCaller.structure.updateStructureInfo(input)
    const structure = await prismaClient.structure.findUniqueOrThrow({
      where: { id: structureId }
    })
    expect(structure.name).toBe(input.name)
    expect(structure.email).toBe(input.email)
    expect(structure.city).toBe(input.city)
  })
})
