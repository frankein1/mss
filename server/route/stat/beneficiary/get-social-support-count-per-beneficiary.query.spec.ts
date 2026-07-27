import { describe, expect, beforeAll, afterAll } from 'vitest'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import type { AppRouter } from '~/server/trpc/routers'
import { prismaClient } from '~/server/prisma'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary
} from '~/prisma/fixtures'

type Input = inferProcedureInput<
  AppRouter['stat']['getSocialSupportCountPerBeneficiaryStats']
>

type Output = inferProcedureOutput<
  AppRouter['stat']['getSocialSupportCountPerBeneficiaryStats']
>

// Flattens the bucket list into a { bucketKey: count } map for easier assertions
const parseStats = (stats: Output): Record<string, number> =>
  stats.reduce<Record<string, number>>(
    (acc, { key, _count }) => ({
      ...acc,
      [key]: _count
    }),
    {}
  )

const structureId = fixtureStructures[FixtureStructure.Ministère].id
const createdById = fixturesUsers[FixtureUserRole.StructureManagerMinistere].id

// One beneficiary per bucket: 1 suivi, 2 suivis, 3 suivis (falls in the "3 et plus" bucket)
const beneficiarySuiviCounts = [
  { beneficiary: fixturesBeneficiaries[FixtureBeneficiary.MARTIN], count: 1 },
  { beneficiary: fixturesBeneficiaries[FixtureBeneficiary.DUPONT], count: 2 },
  { beneficiary: fixturesBeneficiaries[FixtureBeneficiary.LEROY], count: 3 }
]

const socialSupportIds: string[] = []

beforeAll(async () => {
  for (const { beneficiary, count } of beneficiarySuiviCounts) {
    for (let i = 0; i < count; i++) {
      const socialSupport = await prismaClient.socialSupport.create({
        select: { id: true },
        data: {
          structure: { connect: { id: structureId } },
          familyFile: { connect: { id: beneficiary.familyFileId } },
          beneficiary: { connect: { id: beneficiary.id } },
          createdBy: { connect: { id: createdById } },
          socialSupportType: 'Followup',
          status: 'Done',
          date: new Date(),
          followup: { create: { medium: 'PhoneCall' } }
        }
      })
      socialSupportIds.push(socialSupport.id)
    }
  }
})

afterAll(async () => {
  await prismaClient.socialSupport.deleteMany({
    where: { id: { in: socialSupportIds } }
  })
})

describe('Statistics - Beneficiary - Social Support Count Per Beneficiary', () => {
  test('should compute stats as a structure manager from a ministère structure with no filters', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManagerMinistere.stat.getSocialSupportCountPerBeneficiaryStats(
        input
      )

    expect(parseStats(stats)).toEqual({
      '0': 1, // MOREAU
      '1': 1, // MARTIN
      '2': 1, // DUPONT
      '3+': 1 // LEROY
    })
  })

  test('should not allow stats computation as a reception agent', async ({
    trpc
  }) => {
    const input: Input = {}

    await expect(() =>
      trpc.receptionAgent.stat.getSocialSupportCountPerBeneficiaryStats(input)
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('should compute stats as a structure manager from a non-ministère structure', async ({
    trpc
  }) => {
    const input: Input = {}

    const stats =
      await trpc.structureManager.stat.getSocialSupportCountPerBeneficiaryStats(
        input
      )

    expect(stats).toBeInstanceOf(Array)
  })
})
