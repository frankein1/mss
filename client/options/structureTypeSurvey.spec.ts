import { describe, test, expect } from 'vitest'
import { SurveySocialSupportType, SurveyStructureType } from '@prisma/client'
import {
  surveySocialSupportTypeKeys,
  surveyStructureTypeKeys
} from './structureTypeSurvey'

const sortLabels = (labels: string[]) =>
  [...labels].sort((a, b) => a.localeCompare(b, 'fr'))

describe('structure type survey options', () => {
  test('structure type options cover every enum value', () => {
    expect(surveyStructureTypeKeys.keys).toHaveLength(
      Object.keys(SurveyStructureType).length
    )
  })

  test('structure type options are sorted alphabetically with "Autre" last', () => {
    const labels = surveyStructureTypeKeys.options.map(({ label }) => label)
    expect(labels.at(-1)).toBe('Autre...')
    const labelsWithoutAutre = labels.slice(0, -1)
    expect(labelsWithoutAutre).toEqual(sortLabels(labelsWithoutAutre))
  })

  test('social support type options cover every enum value', () => {
    expect(surveySocialSupportTypeKeys.keys).toHaveLength(
      Object.keys(SurveySocialSupportType).length
    )
  })

  test('social support type options are sorted alphabetically', () => {
    const labels = surveySocialSupportTypeKeys.options.map(({ label }) => label)
    expect(labels).toEqual(sortLabels(labels))
  })
})
