import { prepareFilters, prepareSort } from './helper'
import { getPage } from './queries'
import {
  helpRequestFieldLabels,
  housingHelpRequestFieldLabels
} from '~/client/labels'
import type { ExportFileInstructionsInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getFileInstructionPermissions } from '~/server/security'
import type { RowType } from '~/types/export'
import { formatUserDisplayName } from '~/utils/user'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import {
  socialSupportStatusKeys,
  fileInstructionRefusalReasonKeys,
  paymentMethodKeys,
  ministerKeys,
  askedHousingKeys,
  housingReasonKeys,
  housingTypeKeys,
  roomCountKeys,
  lowIncomeHousingKeys
} from '~/client/options'
import { formatBeneficiaryDisplayName } from '~/utils'
import { formatMinisterName } from '~/utils/minister'

export const FIELDS: (keyof typeof helpRequestFieldLabels)[] = [
  'status',
  'date',
  'isFirst',
  'beneficiaryId',
  'financialSupport',
  'subjectId',
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

export const HOUSING_FIELDS: (keyof typeof housingHelpRequestFieldLabels)[] = [
  'askedHousing',
  'reason',
  'taxHouseholdAdditionalInformation',
  'maxRent',
  'maxCharges',
  'housingType',
  'roomCount',
  'lowIncomeHousingType',
  'isPmr'
]

export async function exportFileInstructions({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFileInstructionsInput
}) {
  const columns = [
    ...FIELDS.map(key => ({
      key,
      header: helpRequestFieldLabels[key]
    })),
    ...HOUSING_FIELDS.map(key => ({
      key,
      header: housingHelpRequestFieldLabels[key]
    }))
  ]

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const fileInstructions = await getPage(ctx, {
    where,
    orderBy
  })

  const rows = fileInstructions.reduce(
    (fileInstructions: RowType[], fileInstruction) => {
      const { socialSupport, helpRequest, housingHelpRequest } = fileInstruction
      const { familyFile, beneficiary } = socialSupport
      const permissions = getFileInstructionPermissions({
        ctx,
        familyFile,
        socialSupport
      })
      if (!permissions.view) {
        return fileInstructions
      }
      // File instructions have 1 sss but in the model a social support
      // can be linked to several sss.
      const subjectId = socialSupport.subjects?.[0]?.name || ''

      return [
        ...fileInstructions,
        {
          beneficiaryId: formatBeneficiaryDisplayName(beneficiary),
          financialSupport: getBooleanOrEmpty(helpRequest?.financialSupport),
          prescribingOrganizationId:
            helpRequest?.prescribingOrganization?.name ||
            housingHelpRequest?.prescribingOrganization?.name ||
            '',
          externalStructure: getExternalStructure(
            fileInstruction.externalStructure
          ),
          instructorOrganizationId:
            fileInstruction.instructorOrganization?.name || '',
          date: formatDate(socialSupport.date, 'DD-MM-YYYY'),
          subjectId,
          documents:
            socialSupport.documents
              ?.map(document => document.name)
              .join(', ') || '',
          status: socialSupportStatusKeys.value(socialSupport.status) || '',
          isFirst: getIsFirst(housingHelpRequest?.isFirst),
          askedAmount: helpRequest?.askedAmount?.toString() || '',
          examinationDate: formatDate(
            fileInstruction.examinationDate,
            'DD-MM-YYYY'
          ),
          decisionDate: formatDate(fileInstruction.decisionDate, 'DD-MM-YYYY'),
          allocatedAmount: helpRequest?.allocatedAmount?.toString() || '',
          paymentMethod:
            paymentMethodKeys.value(helpRequest?.paymentMethod) || '',
          paymentDate: formatDate(helpRequest?.paymentDate, 'DD-MM-YYYY'),
          handlingDate: formatDate(helpRequest?.handlingDate, 'DD-MM-YYYY'),
          refusalReason:
            fileInstruction.refusalReasonOther ||
            fileInstructionRefusalReasonKeys.value(
              fileInstruction.refusalReason
            ) ||
            '',
          dispatchDate: formatDate(fileInstruction.dispatchDate, 'DD-MM-YYYY'),
          synthesis: socialSupport.synthesis || '',
          dueDate: formatDate(socialSupport.dueDate, 'DD-MM-YYYY'),
          fullFile: getBooleanOrEmpty(fileInstruction.fullFile),
          // Ideally it should be converted into timezone of the user
          updated: formatDate(socialSupport.updated, 'DD-MM-YYYY HH:mm'),
          ministre: socialSupport.minister
            ? formatMinisterName(socialSupport.minister)
            : '',
          numeroPegase: socialSupport.numeroPegase || '',
          createdById: socialSupport.createdBy
            ? formatUserDisplayName(socialSupport.createdBy)
            : '',
          askedHousing:
            (housingHelpRequest?.askedHousing || [])
              .map(ah => askedHousingKeys.value(ah))
              .join(', ') || '',
          reason: housingReasonKeys.value(housingHelpRequest?.reason) || '',
          taxHouseholdAdditionalInformation:
            housingHelpRequest?.taxHouseholdAdditionalInformation || '',
          maxRent: housingHelpRequest?.maxRent?.toString() || '',
          maxCharges: housingHelpRequest?.maxCharges?.toString() || '',
          housingType:
            (housingHelpRequest?.housingType || [])
              .map(ht => housingTypeKeys.value(ht))
              .join(', ') || '',
          roomCount:
            (housingHelpRequest?.roomCount || [])
              .map(rc => roomCountKeys.value(rc))
              .join(', ') || '',
          lowIncomeHousingType:
            (housingHelpRequest?.lowIncomeHousingType || [])
              .map(li => lowIncomeHousingKeys.value(li))
              .join(', ') || '',
          isPmr: getBooleanOrEmpty(housingHelpRequest?.isPmr)
        }
      ]
    },
    []
  )

  return { rows, columns }
}

function getExternalStructure(externalStructure: boolean | null | undefined) {
  if (externalStructure === true) {
    return 'Organisation extérieure'
  }
  if (externalStructure === false) {
    return 'Interne'
  }
  return ''
}

function getIsFirst(isFirst: boolean | null | undefined) {
  if (isFirst === true) {
    return '1ère demande'
  }
  if (isFirst === false) {
    return 'Renouvellement'
  }
  return ''
}
