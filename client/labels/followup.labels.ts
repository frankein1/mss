import type { Followup } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type FollowupFieldLabels = Omit<
  Followup & { types: string; documents: string },
  'created' | 'id' | 'structureId' | 'createdById' | 'updated'
>

export const followupFieldLabels: FieldLabels<FollowupFieldLabels> = {
  beneficiaryId: 'Bénéficiaire',
  types: "Objet(s) de l'entretien",
  medium: "Type d'entretien",
  documents: 'Document(s)',
  status: 'Statut',
  date: 'Date de saisie',
  dueDate: "Date d'échéance",
  place: 'Lieu de rendez-vous',
  thirdPersonName: 'Tierce personne',
  structureName: "Nom de l'organisme",
  synthesis: 'Compte rendu',
  privateSynthesis: 'Compte rendu privé',
  redirected: "Réorienté après l'entretien",
  helpRequested: "Instruction de demande d'aide",
  classified: 'Classé',
  firstFollowup: '1er entretien',
  forwardedToJustice: 'Transmis à la justice',
  ministre: 'Ministre',
  numeroPegase: 'Numéro Pégase',
  interventions: 'Interventions',
  signalements: 'Signalements',
  prescribingOrganizationId: 'Organisme prescripteur'
}
