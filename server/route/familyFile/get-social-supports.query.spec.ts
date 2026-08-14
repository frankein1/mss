import { describe, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { inferProcedureInput } from '@trpc/server'
import { FixtureBeneficiary, fixturesFamilyFiles } from '~~/prisma/fixtures'
import { test } from '~~/test/server/test-utils'

import type { AppRouter } from '~~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['file']['getSocialSupports']>

mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return {
      app: { baseURL: '/' },
      rdvsp: {
        issuer: 'https://demo.anct.gouv.fr'
      }
    }
  }
})

describe('FamilyFile - Get Social Supports - StructureManager', () => {
  test('should get all social supports when no filter', async ({ trpc }) => {
    const input: Input = {
      familyFileId: fixturesFamilyFiles[FixtureBeneficiary.TEARLE].id,
      filters: {}
    }

    const socialSupports =
      await trpc.structureManager.file.getSocialSupports(input)

    expect(socialSupports).toHaveLength(4)
  })
})
