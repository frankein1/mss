import { vi, test, expect, beforeEach } from 'vitest'
import { handleStructuresImport } from './structure-import.service'
import { prismaClient } from '~/server/prisma'

beforeEach(async () => {
  vi.stubEnv('NUXT_DATA_INCLUSION_API_URL', 'http://test-api.data-inclusion.fr')
  vi.stubEnv('NUXT_DATA_INCLUSION_API_TOKEN', 'test-token')

  await Promise.all([
    prismaClient.jobResult.deleteMany({}),
    prismaClient.dataInclusionStructureV1.deleteMany({})
  ])
})

test('Structure import job should create structures when they do not exist', async () => {
  const job = await handleStructuresImport()

  expect(job.result.nTotal).toBe(10)
  expect(job.result.nImported).toBe(10)
  expect(job.result.nCreated).toBe(0) // Obsolete: will be removed when JobResult is removed from DB
  expect(job.status).toBe('Success')
})

test('Structure import job should store doublons ids on imported structures', async () => {
  await handleStructuresImport()

  const structure =
    await prismaClient.dataInclusionStructureV1.findUniqueOrThrow({
      where: { id: '1' }
    })

  expect(structure.doublons).toEqual([
    'dora--old-id-abc',
    'emplois-de-linclusion--old-id-xyz'
  ])
})

test('Structure import job should update structure when it exists already but is obsolete', async () => {
  await prismaClient.dataInclusionStructureV1.create({
    data: {
      id: '1',
      siret: '1234567890',
      name: 'structure to be updated',
      city: 'Paris',
      zipcode: '75014',
      address: '23 rue des Plantes',
      addressComplement: null,
      phone: null,
      email: null,
      website: null,
      updated: new Date('2015-01-01'),
      workingHours: null
    }
  })

  const job = await handleStructuresImport()

  expect(job.result.nTotal).toBe(10)
  expect(job.result.nImported).toBe(10)
  expect(job.result.nCreated).toBe(0) // Obsolete: will be removed when JobResult is removed from DB
  expect(job.result.nUpdated).toBe(0) // Obsolete: will be removed when JobResult is removed from DB
  expect(job.status).toBe('Success')
})
