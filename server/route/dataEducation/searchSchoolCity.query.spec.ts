import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixturesDataEducationSchools,
  FixtureDataEducationSchool
} from '~/prisma/fixtures'

const CITYCODE_LYON_1ER =
  fixturesDataEducationSchools[FixtureDataEducationSchool.Lyon1erA]!.citycode
const CITYCODE_LYON_2E =
  fixturesDataEducationSchools[FixtureDataEducationSchool.Lyon2e]!.citycode

describe('School City - Search - Text query (city name only)', () => {
  test('a structure manager can search cities by name', async ({ trpc }) => {
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: 'Lyon'
      })

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          city: 'Lyon 1er Arrondissement',
          citycode: CITYCODE_LYON_1ER
        }),
        expect.objectContaining({
          city: 'Lyon 2e Arrondissement',
          citycode: CITYCODE_LYON_2E
        })
      ])
    )
  })

  test('a social worker can search cities by partial name', async ({
    trpc
  }) => {
    const results = await trpc.socialWorker.dataEducation.searchSchoolCities({
      query: 'ville'
    })

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ city: 'Villeurbanne' })
      ])
    )
  })

  test('two schools in the same arrondissement are deduplicated into one city result', async ({
    trpc
  }) => {
    // Lyon1erA and Lyon1erB share CITYCODE_LYON_1ER — expect a single entry
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: '1er'
      })

    const lyon1erResults = results.filter(r => r.citycode === CITYCODE_LYON_1ER)
    expect(lyon1erResults).toHaveLength(1)
  })

  test('two different arrondissements produce two distinct city results', async ({
    trpc
  }) => {
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: 'Lyon'
      })

    const lyonCitycodes = results
      .filter(
        r => r.citycode === CITYCODE_LYON_1ER || r.citycode === CITYCODE_LYON_2E
      )
      .map(r => r.citycode)
    expect(lyonCitycodes).toHaveLength(2)
  })

  test('search is case-insensitive', async ({ trpc }) => {
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: 'lyon'
      })

    expect(results.some(r => r.citycode === CITYCODE_LYON_1ER)).toBe(true)
  })

  test('returns empty array when no city matches', async ({ trpc }) => {
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: 'ZZZnonexistent'
      })

    expect(results).toHaveLength(0)
  })
})

describe('School City - Search - Query with digits (city name or zipcode prefix)', () => {
  test('a structure manager can search by zipcode prefix', async ({ trpc }) => {
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: '690'
      })

    const zipcodes = results.map(r => r.zipcode)
    expect(zipcodes.some(z => z.startsWith('690'))).toBe(true)
  })

  test('does not return cities whose zipcode only contains the digits but does not start with them', async ({
    trpc
  }) => {
    // '100' is contained in '69100' but does not start with it
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: '100'
      })

    expect(results.some(r => r.zipcode === '69100')).toBe(false)
  })

  test('a structure manager can search by full zipcode', async ({ trpc }) => {
    const results =
      await trpc.structureManager.dataEducation.searchSchoolCities({
        query: '21000'
      })

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ city: 'Dijon', zipcode: '21000' })
      ])
    )
  })
})

describe('School City - Search - Authorizations', () => {
  test('a referent can search school cities', async ({ trpc }) => {
    const results = await trpc.referent.dataEducation.searchSchoolCities({
      query: 'Lyon'
    })

    expect(Array.isArray(results)).toBe(true)
  })

  test('a reception agent can search school cities', async ({ trpc }) => {
    const results = await trpc.receptionAgent.dataEducation.searchSchoolCities({
      query: 'Lyon'
    })

    expect(Array.isArray(results)).toBe(true)
  })

  test('an administrator cannot access protected procedures', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.administrator.dataEducation.searchSchoolCities({ query: 'Lyon' })
    ).rejects.toThrow(/user routes are not available to admins/i)
  })
})
