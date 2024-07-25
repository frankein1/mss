import { describe, expect } from 'vitest'
import { inferProcedureInput } from '@trpc/server'
import {
  fixtureStructures,
  fixturesBeneficiaries,
  FixtureBeneficiary
} from '~/prisma/fixtures'
import { test } from '~/test/server/test-utils'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['file']['getFamilyFileMinimalInfo']>

describe('FamilyFile - Get MinimalInfo - StructureManager', () => {
  test('should not get MinimalInfo of a FamilyFile when not in the same structure as a structure manager', async ({
    trpc
  }) => {
    const input: Input = {
      id: fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id
    }

    await expect(() =>
      trpc.structureManager.file.getFamilyFileMinimalInfo(input)
    ).rejects.toThrowError(/no familyfile found/i)
  })

  test('should not get MinimalInfo of a FamilyFile when id does not exist as a structure manager', async ({
    trpc
  }) => {
    const input: Input = { id: 'fca51db4-0b2e-43f1-9929-ba5e4c0d26b3' }

    await expect(() =>
      trpc.structureManager.file.getFamilyFileMinimalInfo(input)
    ).rejects.toThrowError(/no familyfile found/i)
  })

  test('should get MinimalInfo of a FamilyFile when belongs to structure as a structure manager', async ({
    trpc
  }) => {
    const idTearle = fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id

    const input: Input = {
      id: idTearle
    }

    const info =
      await trpc.structureManager.file.getFamilyFileMinimalInfo(input)

    expect(info).toEqual({
      id: idTearle,
      structureId: fixtureStructures[0].id,
      beneficiaries: [
        {
          id: idTearle,
          firstName: 'Måns',
          usualName: 'TEARLE',
          birthName: 'FIRTH',
          birthDate: null,
          relationship: null
        }
      ]
    })
  })
})
