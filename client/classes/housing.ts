import { HousingType } from '@prisma/client'

export const housingTypeBadgeClasses: {
  [key in HousingType]: string
} = {
  [HousingType.Appartement]: 'fr-icon-building-fill',
  [HousingType.Maison]: 'fr-icon-home-4-fill'
}
