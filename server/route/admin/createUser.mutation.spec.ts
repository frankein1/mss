import { describe, expect, afterEach, beforeEach } from 'vitest'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    app: { baseURL: '/' },
    public: { email: { from: 'mss@example.com' } },
    document: { useS3Storage: true }
  })
})

const structureId = fixtureStructures[FixtureStructure.Test].id

const createdIds: string[] = []

const track = <T extends { id: string }>(result: T) => {
  createdIds.push(result.id)
  return result
}

beforeEach(async () => {
  await prismaClient.user.deleteMany({
    where: { email: 'spec-create-user@test.com' }
  })
})

afterEach(async () => {
  if (createdIds.length) {
    await prismaClient.user.deleteMany({
      where: { id: { in: createdIds } }
    })
    createdIds.length = 0
  }
})

const validInput = {
  firstName: 'Spec',
  lastName: 'User',
  email: 'spec-create-user@test.com',
  role: 'SocialWorker' as const,
  status: 'Active' as const,
  structureId
}

describe('Admin - Create User - Authorizations', () => {
  test('A non-admin user is rejected', async ({ trpc }) => {
    await expect(() =>
      trpc.structureManager.admin.createUser(validInput)
    ).rejects.toThrow(/user is not an administrator/i)
  })
})

describe('Admin - Create User - Happy path', () => {
  test('An administrator can create a user in a structure', async ({
    trpc
  }) => {
    const result = track(await trpc.administrator.admin.createUser(validInput))

    expect(result.id).toBeDefined()

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id: result.id }
    })
    expect(user.firstName).toBe('Spec')
    expect(user.lastName).toBe('User')
    expect(user.email).toBe('spec-create-user@test.com')
    expect(user.role).toBe('SocialWorker')
    expect(user.structureId).toBe(structureId)
  })
})

describe('Admin - Create User - Duplicate email', () => {
  test('An administrator cannot create a user with an existing email', async ({
    trpc
  }) => {
    const existingEmail = fixturesUsers[FixtureUserRole.SocialWorker].email

    await expect(() =>
      trpc.administrator.admin.createUser({
        ...validInput,
        email: existingEmail
      })
    ).rejects.toThrow(/user with this email already exists/i)
  })
})
