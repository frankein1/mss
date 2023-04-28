import { Gender } from '@prisma/client'
import { STATS_NULL_COLOR, STATS_NULL_LABEL } from '~/utils/constants'

export const genderWording: { [gender in Gender]: string } = {
  [Gender.Female]: 'Femme',
  [Gender.Male]: 'Homme',
  [Gender.Other]: 'Autre'
}

const genderColors = {
  [Gender.Female]: '#FF8886',
  [Gender.Male]: '#8D81E4',
  [Gender.Other]: '#FFCD56'
}

export const getGenderWording = (gender: Gender | null): string =>
  gender ? genderWording[gender] : STATS_NULL_LABEL

export const getGenderColor = (gender: Gender | null): string =>
  gender ? genderColors[gender] : STATS_NULL_COLOR
