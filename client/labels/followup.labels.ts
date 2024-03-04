import { Followup, SocialSupport } from '@prisma/client'
import { FieldLabels } from '~/types/fieldLabels'

type FollowupFieldLabels = Omit<
  Omit<Followup, 'socialSupportId'> & Omit<SocialSupport, 'socialSupportType'>,
  'created' | 'structureId'
> & {
  types: string
  documents: string
}

export const followupFieldLabels: FieldLabels<FollowupFieldLabels> = {
  id: 'Identifiant',
  beneficiaryId: 'Bénéficiaire',
  types: "Objet(s) de l'accompagnement",
  medium: "Type d'entretien",
  documents: 'Documents',
  status: 'Statut',
  date: 'Date de saisie',
  dueDate: "Date d'échéance",
  place: 'Lieu de rendez-vous',
  thirdPersonName: 'Tierce personne',
  structureName: "Nom de l'organisme",
  synthesis: 'Compte rendu',
  privateSynthesis: 'Compte rendu privé',
  redirected: "Réorienté après l'entretien",
  helpRequested: 'Instruction de dossier',
  classified: 'Classé',
  firstFollowup: '1er entretien',
  forwardedToJustice: 'Transmis à la justice',
  ministre: 'Ministre',
  numeroPegase: 'Numéro Pégase',
  prescribingOrganizationId: 'Organisme prescripteur',
  updated: 'Dernière mise à jour',
  createdById: 'Agent',
  duration: "Durée de l'entretien"
}
