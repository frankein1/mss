import { buildKeys } from '~/utils/keys/keyBuilder'

export enum AgeGroup {
  Less18 = 'less-18',
  Group18_24 = '18-24',
  Group25_34 = '25-34',
  Group35_44 = '35-44',
  Group45_54 = '45-54',
  Group55_64 = '55-64',
  More65 = '65-more'
}

export const ageGroupKeys = buildKeys({
  [AgeGroup.Less18]: '- de 18 ans',
  [AgeGroup.Group18_24]: '18 à 24 ans',
  [AgeGroup.Group25_34]: '25 à 34 ans',
  [AgeGroup.Group35_44]: '35 à 44 ans',
  [AgeGroup.Group45_54]: '45 à 54 ans',
  [AgeGroup.Group55_64]: '55 à 64 ans',
  [AgeGroup.More65]: '65 ans et +'
})
