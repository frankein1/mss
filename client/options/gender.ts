import { Gender } from '@prisma/client'

export const genderLabel: { [gender in Gender]: string } = {
  [Gender.Female]: 'Femme',
  [Gender.Male]: 'Homme',
  [Gender.Other]: 'Autre'
}
