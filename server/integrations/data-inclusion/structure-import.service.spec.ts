import { vi, test, expect, beforeEach } from 'vitest'
import { DataInclusionHandler } from './structure-import.service'
import { createStructure } from '~/server/query/data-inclusion'
import { prismaClient } from '~/server/prisma'

vi.mock('~/server/lib/data-inclusion')

beforeEach(async () => {
  await Promise.all([
    prismaClient.jobResult.deleteMany({}),
    prismaClient.dataInclusionStructure.deleteMany({})
  ])
})

test.skip('Structure import job should create structures when they do not exist', async () => {
  const job = await DataInclusionHandler.handleStructuresImport()

  expect(job.result.nToImport).toBe(10)
  expect(job.result.nImported).toBe(10)
  expect(job.result.nCreated).toBe(10)
  expect(job.status).toBe('Success')
})

test.skip('Structure import job should update structure when it exists already but is obsolete', async () => {
  await createStructure(
    {
      id: 1,
      siret: '1234567890',
      rna: null,
      name: 'structure to be updated',
      city: 'Paris',
      zipcode: '75014',
      address: '23 rue des Plantes',
      addressComplement: null,
      type: null,
      phone: null,
      email: null,
      website: null,
      updated: new Date(),
      isBranch: false,
      workingHours: null,
      topics: []
    },
    'unknown'
  )

  const job = await DataInclusionHandler.handleStructuresImport()

  expect(job.result.nToImport).toBe(10)
  expect(job.result.nImported).toBe(10)
  expect(job.result.nCreated).toBe(9)
  expect(job.result.nUpdated).toBe(1)
  expect(job.status).toBe('Success')
})
