import { FieldLabels } from '~/types/fieldLabels'
import type { EditCurrentUserStructureInput } from '~/server/schema'

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
