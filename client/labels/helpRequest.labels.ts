import type { HelpRequest } from '@prisma/client'
import type { FieldLabels } from '~/types/fieldLabels'

type HelpRequestFieldLabels = Omit<
  HelpRequest,
  | 'id'
  | 'structureId'
  | 'createdById'
  | 'updated'
  | 'prescribingOrganizationId'
  | 'openingDate' // TODO: Add missing labels
  | 'typeId'
  | 'decisionDate'
  | 'financialSupport'
  | 'externalStructure'
  | 'refusalReason'
  | 'dispatchDate'
  | 'synthesis'
  | 'privateSynthesis'
  | 'fullFile'
  | 'reason'
  | 'created'
  | 'ministre'
  | 'numeroPegase'
>

export const helpRequestFieldLabels: FieldLabels<HelpRequestFieldLabels> = {
  status: 'Statut',
  dueDate: "Date d'échéance",
  beneficiaryId: 'Bénéficiaire',
  examiningOrganisation: 'Organisme instructeur',
  examinationDate: 'Date de passage en commission',
  askedAmount: 'Montant demandé',
  allocatedAmount: 'Montant attribué',
  paymentMethod: 'Mode de paiement',
  paymentDate: 'Date du paiement',
  handlingDate: 'Date de fin de prise en charge'
}
