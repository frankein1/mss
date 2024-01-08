import { prepareHelpRequestFilters } from './helper'
import { getPage } from './queries'
import { helpRequestFieldLabels } from '~/client/labels'
import { ExportHelpRequestsInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { RowType } from '~/types/export'
import { formatUserDisplayName } from '~/utils/user'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import {
  helpRequestRefusalReasonLabels,
  helpRequestStatusLabels,
  paymentMethodLabels,
  helpRequestSubjectLabels
} from '~/client/options/helpRequest'
import { ministerLabels } from '~/client/options/ministry'

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

export async function exportHelpRequests({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportHelpRequestsInput
}) {
  const columns = HELP_REQUEST_EXPORTED_FIELDS.map(key => ({
    key,
    header: helpRequestFieldLabels[key]
  }))

  const where = prepareHelpRequestFilters(input.filters)

  const helpRequests = await getPage(ctx, {
    where
  })

  const rows = helpRequests.reduce(
    (helpRequests: RowType[], { permissions, helpRequest }) => {
      if (permissions.view) {
        helpRequests.push({
          beneficiaryId: formatBeneficiaryDisplayName(helpRequest.beneficiary),
          subject: helpRequestSubjectLabels[helpRequest.subject],
          prescribingOrganizationId:
            helpRequest.prescribingOrganization?.name || '',
          externalStructure: getExternalStructure(
            helpRequest.externalStructure
          ),
          instructorOrganizationId:
            helpRequest.instructorOrganization?.name || '',
          openingDate: formatDate(helpRequest.openingDate, 'DD-MM-YYYY'),
          typeId: helpRequest.type.name,
          documents:
            helpRequest.documents?.map(document => document.name).join(', ') ||
            '',
          status: helpRequestStatusLabels[helpRequest.status],
          askedAmount: helpRequest.askedAmount?.toString() || '',
          examinationDate: formatDate(
            helpRequest.examinationDate,
            'DD-MM-YYYY'
          ),
          decisionDate: formatDate(helpRequest.decisionDate, 'DD-MM-YYYY'),
          allocatedAmount: helpRequest.allocatedAmount?.toString() || '',
          paymentMethod: helpRequest.paymentMethod
            ? paymentMethodLabels[helpRequest.paymentMethod]
            : '',
          paymentDate: formatDate(helpRequest.paymentDate, 'DD-MM-YYYY'),
          handlingDate: formatDate(helpRequest.handlingDate, 'DD-MM-YYYY'),
          refusalReason:
            helpRequest.refusalReasonOther ||
            (helpRequest.refusalReason
              ? helpRequestRefusalReasonLabels[helpRequest.refusalReason]
              : ''),
          dispatchDate: formatDate(helpRequest.dispatchDate, 'DD-MM-YYYY'),
          synthesis: helpRequest.synthesis || '',
          dueDate: formatDate(helpRequest.dueDate, 'DD-MM-YYYY'),
          fullFile: getBooleanOrEmpty(helpRequest.fullFile),
          updated: formatDate(helpRequest.updated, 'DD-MM-YYYY HH:mm'),
          ministre: helpRequest.ministre
            ? ministerLabels[helpRequest.ministre]
            : '',
          numeroPegase: helpRequest.numeroPegase || '',
          createdById: helpRequest.createdBy
            ? formatUserDisplayName(helpRequest.createdBy)
            : ''
        })
      }
      return helpRequests
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
