import { FieldLabels } from '~/types/fieldLabels'
import type {
  EditCurrentUserStructureInput,
  AdminCreateStructureInput
} from '~/server/schema'

export const structureFieldLabels: FieldLabels<EditCurrentUserStructureInput> =
  {
    name: 'Raison sociale',
    zipcode: 'Code postal',
    city: 'Ville',
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'Email',
    legallyRequiredFollowupTypes: 'Aides légales',
    legallyNotRequiredFollowupTypes: 'Aides facultatives'
  }

export const adminStructureFieldLabels: FieldLabels<
  Required<AdminCreateStructureInput>
> = {
  ...structureFieldLabels,
  type: 'Type',
  inhabitantsNumber: "Nombre d'habitants",
  inseeCode: 'Code INSEE',
  siret: 'SIRET'
}
