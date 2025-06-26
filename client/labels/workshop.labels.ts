import { Workshop } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type WorkshopFieldLabels = Omit<
  Workshop & {},
  'partnerOrganization' | 'structure' | 'structureId'
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
