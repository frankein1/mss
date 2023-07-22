import {
  beneficiaryFieldLabels,
  followupFieldLabels,
  helpRequestFieldLabels
} from '~/client/labels'

export const EXPORT_DEFAULT_FONT = {
  name: 'Calibri',
  size: 12
}

export const FOLLOWUP_EXPORTED_FIELDS: (keyof typeof followupFieldLabels)[] = [
  'id',
  'date',
  'firstFollowup',
  'status',
  'redirected',
  'types',
  'beneficiaryId',
  'medium',
  'classified',
  'documents',
  'dueDate',
  'forwardedToJustice',
  'helpRequested',
  'interventions',
  'ministre',
  'numeroPegase',
  'place',
  'signalements',
  'structureName',
  'synthesis',
  'thirdPersonName',
  'updated',
  'prescribingOrganizationId'
]

export const HELP_REQUEST_EXPORTED_FIELDS: (keyof typeof helpRequestFieldLabels)[] =
  [
    'id',
    'beneficiaryId',
    'prescribingOrganizationId',
    'externalStructure',
    'instructorOrganizationId',
    'openingDate',
    'typeId',
    'documents',
    'financialSupport',
    'status',
    'askedAmount',
    'examinationDate',
    'decisionDate',
    'allocatedAmount',
    'paymentMethod',
    'paymentDate',
    'handlingDate',
    'refusalReason',
    'dispatchDate',
    'synthesis',
    'dueDate',
    'fullFile',
    'reason',
    'updated',
    'ministre',
    'numeroPegase'
  ]

export const BENEFICIARY_EXPORTED_FIELDS: (keyof typeof beneficiaryFieldLabels)[] =
  ['id']
