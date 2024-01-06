import { helpRequestFieldLabels } from '~/client/labels'

export const EXPORT_DEFAULT_FONT = {
  name: 'Calibri',
  size: 12
}

export const HELP_REQUEST_EXPORTED_FIELDS: (keyof typeof helpRequestFieldLabels)[] =
  [
    'status',
    'openingDate',
    'beneficiaryId',
    'subject',
    'typeId',
    'examinationDate',
    'decisionDate',
    'prescribingOrganizationId',
    'synthesis',
    'externalStructure',
    'dispatchDate',
    'instructorOrganizationId',
    'askedAmount',
    'allocatedAmount',
    'paymentMethod',
    'paymentDate',
    'documents',
    'handlingDate',
    'refusalReason',
    'refusalReasonOther',
    'dueDate',
    'fullFile',
    'updated',
    'ministre',
    'numeroPegase',
    'createdById'
  ]


