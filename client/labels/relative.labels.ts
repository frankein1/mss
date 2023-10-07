import type { BeneficiaryRelative } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type RelativeFieldLabels = Omit<
  BeneficiaryRelative,
  'createdById' | 'created' | 'hosted' | 'beneficiaryId' | 'updated'
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
  city: 'Ville',
  linkedBeneficiaryId: 'Fiche bénéficiaire liée'
}

export { relativeFieldLabels }
