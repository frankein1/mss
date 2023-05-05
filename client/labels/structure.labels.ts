import { Structure } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

type StructureFieldLabels = Omit<
  Structure,
  'type' | 'inhabitantsNumber' | 'inseeCode' | 'siret' | 'created' | 'updated'
>

export const structureFieldLabels: FieldLabels<StructureFieldLabels> = {
  id: 'Identifiant',
  name: 'Raison sociale',
  zipcode: 'Code postal',
  city: 'Ville',
  address: 'Adresse',
  phone: 'Téléphone',
  email: 'Email'
}
