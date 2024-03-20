import { FieldLabels } from '~/types/fieldLabels'
import type { AdminCreateStructureInput } from '~/server/schema'

export const structureFieldLabels: FieldLabels<
  Required<AdminCreateStructureInput>
> = {
  name: 'Raison sociale',
  zipcode: 'Code postal',
  city: 'Ville',
  address: 'Adresse',
  phone: 'Téléphone',
  email: 'Email',
  type: 'Type',
  inhabitantsNumber: "Nombre d'habitants",
  inseeCode: 'Code INSEE',
  siret: 'SIRET'
}
