import type { HelpRequest } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type HelpRequestFieldLabels = Omit<
  HelpRequest,
  'structureId' | 'created' | 'reason' | 'financialSupport'
> & {
  documents: string
}

export const helpRequestFieldLabels: FieldLabels<HelpRequestFieldLabels> = {
  id: 'Identifiant',
  status: 'Statut',
  dueDate: "Date d'échéance",
  beneficiaryId: 'Bénéficiaire',
  examinationDate: 'Date de passage en commission',
  askedAmount: 'Montant demandé',
  allocatedAmount: 'Montant attribué',
  paymentMethod: 'Mode de paiement',
  paymentDate: 'Date du paiement',
  handlingDate: 'Date de fin de prise en charge',
  openingDate: "Date d'ouverture du dossier",
  numeroPegase: 'Numéro Pégase',
  ministre: 'Ministre',
  typeId: "Objet de l'accompagnement",
  prescribingOrganizationId: 'Organisme prescripteur',
  fullFile: 'Ce dossier est complet',
  instructorOrganizationId: 'Organisme instructeur',
  dispatchDate: "Date d'envoi du dossier",
  decisionDate: 'Date de la décision',
  refusalReason: 'Motif du refus',
  refusalReasonOther: 'Autre motif du refus',
  synthesis: 'Compte rendu',
  privateSynthesis: 'Compte rendu privé',
  documents: 'Documents',
  externalStructure: 'Demande réalisée',
  updated: 'Dernière mise à jour',
  createdById: 'Agent',
  subject: "Type d'instruction de dossier"
}
