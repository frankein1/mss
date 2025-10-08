import type { Workshop, WorkshopExternalAttendee } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type WorkshopFieldLabels = Omit<
  Workshop & { name: string },
  | 'partnerOrganization'
  | 'structure'
  | 'structureId'
  | 'createdAt'
  | 'createdById'
  | 'workshopNameId'
>

export const workshopLabels: FieldLabels<WorkshopFieldLabels> = {
  id: 'Identifiant',
  name: 'Nom de l’atelier / thématique',
  date: 'Date',
  startTime: 'Heure de début',
  endTime: 'Heure de fin',
  location: 'Lieu',
  partnerOrganizationId: 'Partenaire ou organisme financeur',
  host: 'Personne intervenante',
  sessionName: 'Nom ou numéro de cette séance',
  description: 'Description / notes',
  attendeeLimit: 'Nombre de personnes participantes',
  ageLimitCondition: 'Conditions d’âge (à titre informatif)',
  ageLimit: 'Age (ans)'
}

export const workshopExternalAttendeeLabels = {
  id: 'Identifiant',
  firstName: 'Prénom',
  lastName: 'Nom',
  gender: 'Genre',
  email: 'Email',
  phone: 'Téléphone',
  birthDate: 'Date de naissance',
  city: 'Ville'
} satisfies FieldLabels<
  Omit<WorkshopExternalAttendee, 'created' | 'updated' | 'isAnonymized'>
>
