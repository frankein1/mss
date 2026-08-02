import { describe, test, expect } from 'vitest'
import { BeneficiaryFamilySituation } from '@prisma/client'
import { isMarried } from './isMarried'

describe('isMarried', () => {
  test('should return true for Married', () => {
    expect(isMarried(BeneficiaryFamilySituation.Married)).toBe(true)
  })

  test('should return true for CivilUnion', () => {
    expect(isMarried(BeneficiaryFamilySituation.CivilUnion)).toBe(true)
  })

  test('should return false for Single', () => {
    expect(isMarried(BeneficiaryFamilySituation.Single)).toBe(false)
  })

  test('should return false for null', () => {
    expect(isMarried(null)).toBe(false)
  })
})
