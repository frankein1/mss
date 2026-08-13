import { describe, test, expect } from 'vitest'
import type { StatFilterInput } from '~~/server/schema'
import {
  prepareBeneficiaryStatFilters,
  prepareSocialSupportStatFilters
} from './helpers'

describe('prepareBeneficiaryStatFilters', () => {
  test('school filter alone produces a schoolUai in-filter', () => {
    const filters = { schoolUai: ['0750001A'] } as StatFilterInput

    expect(prepareBeneficiaryStatFilters(filters)).toStrictEqual({
      schoolUai: { in: ['0750001A'] }
    })
  })
})

describe('prepareSocialSupportStatFilters', () => {
  test('school filter alone produces socialSupport.beneficiary.schoolUai', () => {
    const filters = { schoolUai: ['0750001A'] } as StatFilterInput

    expect(prepareSocialSupportStatFilters(filters)).toStrictEqual({
      beneficiary: { schoolUai: { in: ['0750001A'] } }
    })
  })

  test('cities and school combine on the same beneficiary sub-filter', () => {
    const filters = {
      cities: ['Lyon'],
      schoolUai: ['0750001A']
    } as StatFilterInput

    expect(prepareSocialSupportStatFilters(filters)).toStrictEqual({
      beneficiary: {
        city: { in: ['Lyon'] },
        schoolUai: { in: ['0750001A'] }
      }
    })
  })

  test('school, beneficiaryStatus and qpv all merge into the same beneficiary sub-filter', () => {
    const filters = {
      schoolUai: ['0750001A'],
      beneficiaryStatus: 'Active',
      qpv: 'true'
    } as StatFilterInput

    expect(prepareSocialSupportStatFilters(filters)).toStrictEqual({
      beneficiary: {
        schoolUai: { in: ['0750001A'] },
        status: 'Active',
        qpv: true
      }
    })
  })
})
