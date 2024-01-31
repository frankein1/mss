import type { BeneficiaryRelative } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type RelativeFieldLabels = Omit<
  BeneficiaryRelative,
  | 'createdById'
  | 'created'
  | 'hosted'
  | 'beneficiaryId'
  | 'linkedBeneficiaryId'
  | 'updated'
>

const relativeFieldLabels: FieldLabels<RelativeFieldLabels> = {
  id: 'Identifiant',
  lastName: 'Nom',
  firstName: 'Prénom',
  phone: 'Téléphone',
  email: 'Email',
  birthDate: 'Date de naissance',
  relationship: 'Statut',
  caregiver: 'Aidant familial',
  additionalInformation: 'Informations complémentaires',
  city: 'Ville'
}

export { relativeFieldLabels }
