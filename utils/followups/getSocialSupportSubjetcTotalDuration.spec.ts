import { describe, test, expect } from 'vitest'
import { FollowupDuration } from '@prisma/client'
import {
  getSocialSupportSubjectTotalDuration,
  convertDurationInMinutes
} from './getSocialSupportSubjetcTotalDuration'

describe('convertDurationInMinutes', () => {
  test('should convert LessThanQuarter to 8', () => {
    expect(convertDurationInMinutes(FollowupDuration.LessThanQuarter)).toBe(8)
  })

  test('should convert Quarter to 15', () => {
    expect(convertDurationInMinutes(FollowupDuration.Quarter)).toBe(15)
  })

  test('should convert Half to 30', () => {
    expect(convertDurationInMinutes(FollowupDuration.Half)).toBe(30)
  })

  test('should convert ThreeQuarter to 45', () => {
    expect(convertDurationInMinutes(FollowupDuration.ThreeQuarter)).toBe(45)
  })

  test('should convert Hour to 60', () => {
    expect(convertDurationInMinutes(FollowupDuration.Hour)).toBe(60)
  })

  test('should convert MoreThanHour to 90', () => {
    expect(convertDurationInMinutes(FollowupDuration.MoreThanHour)).toBe(90)
  })

  test('should return 0 for null', () => {
    expect(convertDurationInMinutes(null)).toBe(0)
  })
})

describe('getSocialSupportSubjectTotalDuration', () => {
  test('should return 0 for empty array', () => {
    expect(getSocialSupportSubjectTotalDuration([])).toBe(0)
  })

  test('should return average duration in minutes', () => {
    const supports = [
      { followup: { duration: FollowupDuration.Hour } },
      { followup: { duration: FollowupDuration.Half } }
    ]
    expect(getSocialSupportSubjectTotalDuration(supports)).toBe(45)
  })

  test('should treat null duration as 0 minutes', () => {
    const supports = [
      { followup: { duration: FollowupDuration.Hour } },
      { followup: { duration: null } }
    ]
    expect(getSocialSupportSubjectTotalDuration(supports)).toBe(30)
  })

  test('should treat null followup as 0 minutes', () => {
    const supports = [
      { followup: { duration: FollowupDuration.Hour } },
      { followup: null }
    ]
    expect(getSocialSupportSubjectTotalDuration(supports)).toBe(30)
  })

  test('should return exact value for single support', () => {
    const supports = [{ followup: { duration: FollowupDuration.Quarter } }]
    expect(getSocialSupportSubjectTotalDuration(supports)).toBe(15)
  })
})
