import { describe, test, expect } from 'vitest'
import { BeneficiaryFamilySituation } from '@prisma/client'
import { isSeparate } from './isSeparate'

describe('isSeparate', () => {
  test('should return true for Divorced', () => {
    expect(isSeparate(BeneficiaryFamilySituation.Divorced)).toBe(true)
  })

  test('should return true for Separated', () => {
    expect(isSeparate(BeneficiaryFamilySituation.Separated)).toBe(true)
  })

  test('should return true for SingleParentWithChildren', () => {
    expect(
      isSeparate(BeneficiaryFamilySituation.SingleParentWithChildren)
    ).toBe(true)
  })

  test('should return false for Married', () => {
    expect(isSeparate(BeneficiaryFamilySituation.Married)).toBe(false)
  })

  test('should return false for null', () => {
    expect(isSeparate(null)).toBe(false)
  })
})
