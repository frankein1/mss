import { SupportProgramOutcome } from '@prisma/client'
import { describe, test, expect } from 'vitest'
import { supportProgramSchema } from './updateSupportPrograms.schema'

const validBase = {
  id: '00000000-0000-0000-0000-000000000001',
  supportProgramNameId: '00000000-0000-0000-0000-000000000002'
}

describe('Support Program Schema - Outcome validation', () => {
  test('Schema clears outcome when endDate is absent', () => {
    const result = supportProgramSchema.safeParse({
      ...validBase,
      outcome: SupportProgramOutcome.Achieved
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.outcome).toBeNull()
    }
  })

  test('Schema accepts null outcome regardless of endDate', () => {
    const withoutEndDate = supportProgramSchema.safeParse({
      ...validBase,
      outcome: null
    })
    expect(withoutEndDate.success).toBe(true)

    const withEndDate = supportProgramSchema.safeParse({
      ...validBase,
      endDate: new Date('2024-12-31'),
      outcome: null
    })
    expect(withEndDate.success).toBe(true)
  })

  test('Schema accepts valid enum values when endDate is present', () => {
    for (const outcome of Object.values(SupportProgramOutcome)) {
      const result = supportProgramSchema.safeParse({
        ...validBase,
        endDate: new Date('2024-12-31'),
        outcome
      })
      expect(result.success).toBe(true)
    }
  })

  test('Schema accepts omitted outcome', () => {
    const result = supportProgramSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })
})

describe('Support Program Schema - partnerOrganisationIds validation', () => {
  test('Schema accepts an empty array', () => {
    const result = supportProgramSchema.safeParse({
      ...validBase,
      partnerOrganisationIds: []
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.partnerOrganisationIds).toEqual([])
    }
  })

  test('Schema defaults to empty array when omitted', () => {
    const result = supportProgramSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.partnerOrganisationIds).toEqual([])
    }
  })

  test('Schema accepts an array of valid UUIDs', () => {
    const result = supportProgramSchema.safeParse({
      ...validBase,
      partnerOrganisationIds: [
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004'
      ]
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.partnerOrganisationIds).toEqual([
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004'
      ])
    }
  })
})
