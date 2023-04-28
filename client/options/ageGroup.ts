import { STATS_NULL_COLOR, STATS_NULL_LABEL } from '~/utils/constants'

export enum AgeGroup {
  Less25 = 'less-25',
  Group25_34 = '25-34',
  Group35_44 = '35-44',
  Group45_54 = '45-54',
  Group55_64 = '55-64',
  More65 = '65-more'
}

export const AgeGroupLabels = {
  [AgeGroup.Less25]: '- de 25 ans',
  [AgeGroup.Group25_34]: '25 à 34 ans',
  [AgeGroup.Group35_44]: '35 à 44 ans',
  [AgeGroup.Group45_54]: '45 à 54 ans',
  [AgeGroup.Group55_64]: '55 à 64 ans',
  [AgeGroup.More65]: '65 ans et +',
  null: STATS_NULL_LABEL
}

export const AgeGroupColors = {
  [AgeGroup.Less25]: '#BABAFF',
  [AgeGroup.Group25_34]: '#A8A8FF',
  [AgeGroup.Group35_44]: '#8585f6',
  [AgeGroup.Group45_54]: '#6a6af4',
  [AgeGroup.Group55_64]: '#313178',
  [AgeGroup.More65]: '#272747',
  null: STATS_NULL_COLOR
}
