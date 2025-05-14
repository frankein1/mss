import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import {
  prepareBeneficiaryFilters,
  prepareBeneficiarySearchConditions
} from './helper'
import { AgeGroup } from '~/client/options'

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-04-14T16:03:00Z')) // Set a fixed date
})

afterAll(() => {
  vi.useRealTimers() // Restore real timers after tests
})

describe('prepareBeneficiarySearchConditions', () => {
  it('should return a list of combinations grouped by an OR', () => {
    expect(prepareBeneficiarySearchConditions('Martin')).toMatchInlineSnapshot(`
      {
        "AND": [
          {
            "OR": [
              {
                "usualNameNormalized": {
                  "contains": "martin",
                },
              },
              {
                "birthNameNormalized": {
                  "contains": "martin",
                },
              },
              {
                "firstNameNormalized": {
                  "contains": "martin",
                },
              },
            ],
          },
        ],
      }
    `)
  })

  it('should return multiple lists of combinations grouped by an OR when they are multiple input tokens', () => {
    expect(prepareBeneficiarySearchConditions('Martin Mystère'))
      .toMatchInlineSnapshot(`
        {
          "AND": [
            {
              "OR": [
                {
                  "usualNameNormalized": {
                    "contains": "martin",
                  },
                },
                {
                  "birthNameNormalized": {
                    "contains": "martin",
                  },
                },
                {
                  "firstNameNormalized": {
                    "contains": "martin",
                  },
                },
              ],
            },
            {
              "OR": [
                {
                  "usualNameNormalized": {
                    "contains": "mystere",
                  },
                },
                {
                  "birthNameNormalized": {
                    "contains": "mystere",
                  },
                },
                {
                  "firstNameNormalized": {
                    "contains": "mystere",
                  },
                },
              ],
            },
          ],
        }
      `)
  })
})

describe('prepareBeneficiaryFilters', () => {
  it('should return a valid BeneficiaryWhereInput object when multiple parameters are passed', () => {
    const output = prepareBeneficiaryFilters({
      search: 'Jean Paul',
      ageGroup: [AgeGroup.Group18_24, AgeGroup.Group45_54],
      qpv: false,
      status: 'Active',
      referents: ['1E26CD', '878DEG']
    })
    expect(output).toMatchInlineSnapshot(`
      {
        "AND": [
          {
            "OR": [
              {
                "usualNameNormalized": {
                  "contains": "jean",
                },
              },
              {
                "birthNameNormalized": {
                  "contains": "jean",
                },
              },
              {
                "firstNameNormalized": {
                  "contains": "jean",
                },
              },
            ],
          },
          {
            "OR": [
              {
                "usualNameNormalized": {
                  "contains": "paul",
                },
              },
              {
                "birthNameNormalized": {
                  "contains": "paul",
                },
              },
              {
                "firstNameNormalized": {
                  "contains": "paul",
                },
              },
            ],
          },
          {
            "OR": [
              {
                "birthDate": {
                  "gte": 2000-04-15T00:00:00.000Z,
                  "lte": 2007-04-14T00:00:00.000Z,
                },
              },
              {
                "birthDate": {
                  "gte": 1970-04-15T00:00:00.000Z,
                  "lte": 1980-04-14T00:00:00.000Z,
                },
              },
            ],
          },
          {
            "OR": [
              {
                "qpv": null,
              },
              {
                "qpv": false,
              },
            ],
          },
        ],
        "familyFile": {
          "referents": {
            "some": {
              "id": {
                "in": [
                  "1E26CD",
                  "878DEG",
                ],
              },
            },
          },
        },
        "status": "Active",
      }
    `)
  })
})
