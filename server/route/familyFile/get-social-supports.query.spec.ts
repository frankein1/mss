import { describe, expect } from 'vitest'
import { inferProcedureInput } from '@trpc/server'
import {
  FixtureBeneficiary,
  fixturesFamilyFiles,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['file']['getSocialSupports']>

describe('FamilyFile - Get Social Supports - StructureManager', () => {
  test('should get all social supports when no filter', async ({ trpc }) => {
    const input: Input = {
      familyFileId: fixturesFamilyFiles[FixtureBeneficiary.TEARLE].id,
      filters: {}
    }

    const socialSupports =
      await trpc.structureManager.file.getSocialSupports(input)

    expect(socialSupports.items).toHaveLength(4)
    expect(socialSupports.totalCount).toBe(4)
  })

  test('should get no result when filtering on referent with no social support created', async ({
    trpc
  }) => {
    const input: Input = {
      familyFileId: fixturesFamilyFiles[FixtureBeneficiary.TEARLE].id,
      filters: {
        referents: [fixturesUsers[FixtureUserRole.Instructor].id]
      }
    }

    const socialSupports =
      await trpc.structureManager.file.getSocialSupports(input)

    expect(socialSupports.items).toHaveLength(0)
    expect(socialSupports.totalCount).toBe(4)
  })

  test('should display all comments (whether referent or not)', async ({
    trpc
  }) => {
    const input: Input = {
      familyFileId: fixturesFamilyFiles[FixtureBeneficiary.UNKNOWN].id,
      filters: {}
    }

    const socialSupports =
      await trpc.receptionAgent.file.getSocialSupports(input)
    const selected = socialSupports.items.find(
      ss => ss.data.id === '19ed2ebb-4e28-433a-9e2d-d97d9098624a'
    )

    expect(selected?.data.comments).toHaveLength(1)
  })
})

describe('FamilyFile - Get Social Supports - ReceptionAgent', () => {
  test('should display all comments (whether referent or not)', async ({
    trpc
  }) => {
    const input: Input = {
      familyFileId: fixturesFamilyFiles[FixtureBeneficiary.UNKNOWN].id,
      filters: {}
    }

    const socialSupports =
      await trpc.receptionAgent.file.getSocialSupports(input)
    const selected = socialSupports.items.find(
      ss => ss.data.id === '19ed2ebb-4e28-433a-9e2d-d97d9098624a'
    )

    expect(selected?.data.comments).toHaveLength(1)
  })
})
