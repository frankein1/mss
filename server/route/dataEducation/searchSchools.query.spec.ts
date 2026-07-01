import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { SchoolType, SchoolStatus } from '@prisma/client'
import {
  fixturesDataEducationSchools,
  FixtureDataEducationSchool
} from '~/prisma/fixtures'

const CITYCODE_LYON =
  fixturesDataEducationSchools[FixtureDataEducationSchool.SchLyon1]!.citycode
const CITYCODE_DIJON =
  fixturesDataEducationSchools[FixtureDataEducationSchool.SchDijon]!.citycode

describe('School - Search - Filter by city code', () => {
  test('a structure manager can search schools in a specific city', async ({
    trpc
  }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: '',
      citycode: CITYCODE_LYON
    })

    expect(results.length).toBeGreaterThanOrEqual(3)
    expect(results.every(s => s.citycode === CITYCODE_LYON)).toBe(true)
  })

  test('does not return schools from another city', async ({ trpc }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: '',
      citycode: CITYCODE_LYON
    })

    expect(results.every(s => s.citycode !== CITYCODE_DIJON)).toBe(true)
  })

  test('returns empty array when no schools match the citycode', async ({
    trpc
  }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: '',
      citycode: '99999'
    })

    expect(results).toHaveLength(0)
  })
})

describe('School - Search - Filter by name query', () => {
  test('filters schools by name substring', async ({ trpc }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: 'Victor',
      citycode: CITYCODE_LYON
    })

    expect(results).toHaveLength(1)
    expect(results[0]?.name).toBe('Ecole Victor Hugo')
  })

  test('name search is case-insensitive', async ({ trpc }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: 'victor hugo',
      citycode: CITYCODE_LYON
    })

    expect(results).toHaveLength(1)
    expect(results[0]?.uai).toBe(
      fixturesDataEducationSchools[FixtureDataEducationSchool.SchLyon2]!.uai
    )
  })

  test('returns multiple schools when name query matches several', async ({
    trpc
  }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: 'Ecole',
      citycode: CITYCODE_LYON
    })

    expect(results.length).toBeGreaterThanOrEqual(2)
    expect(results.every(s => s.name.toLowerCase().includes('ecole'))).toBe(
      true
    )
  })

  test('returns no results when name does not match', async ({ trpc }) => {
    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: 'ZZZnonexistent',
      citycode: CITYCODE_LYON
    })

    expect(results).toHaveLength(0)
  })
})

describe('School - Search - Returned fields', () => {
  test('returns expected school fields', async ({ trpc }) => {
    const fixture =
      fixturesDataEducationSchools[FixtureDataEducationSchool.SchLyon1]

    const results = await trpc.structureManager.dataEducation.searchSchools({
      query: 'Jean Moulin',
      citycode: CITYCODE_LYON
    })

    expect(results).toHaveLength(1)
    expect(results[0]).toEqual(
      expect.objectContaining({
        uai: fixture!.uai,
        name: fixture!.name,
        type: SchoolType.Ecole,
        zipcode: fixture!.zipcode,
        city: fixture!.city,
        citycode: fixture!.citycode,
        academy: fixture!.academy,
        status: SchoolStatus.OUVERT
      })
    )
  })
})

describe('School - Search - Authorizations', () => {
  test('a social worker can search schools', async ({ trpc }) => {
    const results = await trpc.socialWorker.dataEducation.searchSchools({
      query: '',
      citycode: CITYCODE_LYON
    })

    expect(Array.isArray(results)).toBe(true)
  })

  test('a referent can search schools', async ({ trpc }) => {
    const results = await trpc.referent.dataEducation.searchSchools({
      query: '',
      citycode: CITYCODE_LYON
    })

    expect(Array.isArray(results)).toBe(true)
  })

  test('a reception agent can search schools', async ({ trpc }) => {
    const results = await trpc.receptionAgent.dataEducation.searchSchools({
      query: '',
      citycode: CITYCODE_LYON
    })

    expect(Array.isArray(results)).toBe(true)
  })

  test('an administrator cannot access protected procedures', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.dataEducation.searchSchools({
        query: '',
        citycode: CITYCODE_LYON
      })
    ).rejects.toThrowError(/user routes are not available to admins/i)
  })
})
