import { prepareFilters, prepareSort } from './helper'
import { getPage } from './queries'
import { helpRequestFieldLabels } from '~/client/labels'
import { ExportHelpRequestsInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { RowType } from '~/types/export'
import { formatUserDisplayName } from '~/utils/user'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'

import {} from '~/client/options/ministry'
import {
  socialSupportStatusLabels,
  fileInstructionRefusalReasonLabels,
  paymentMethodLabels,
  ministerLabels
} from '~/client/options'

export const HELP_REQUEST_EXPORTED_FIELDS: (keyof typeof helpRequestFieldLabels)[] =
  [
    'status',
    'date',
    'beneficiaryId',
    'financialSupport',
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

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const helpRequests = await getPage(ctx, {
    where,
    orderBy
  })

  const rows = helpRequests.reduce(
    (helpRequests: RowType[], { permissions, helpRequest }) => {
      if (permissions.view) {
        const { fileInstruction } = helpRequest
        const { socialSupport } = fileInstruction

        const beneficiary = socialSupport.beneficiary
        helpRequests.push({
          beneficiaryId: formatBeneficiaryDisplayName(beneficiary),
          financialSupport: helpRequest.financialSupport,
          prescribingOrganizationId:
            helpRequest.prescribingOrganization?.name || '',
          externalStructure: getExternalStructure(
            fileInstruction.externalStructure
          ),
          instructorOrganizationId:
            fileInstruction.instructorOrganization?.name || '',
          date: formatDate(socialSupport.date, 'DD-MM-YYYY'),
          typeId: helpRequest.type?.name || '',
          documents:
            socialSupport.documents
              ?.map(document => document.name)
              .join(', ') || '',
          status: socialSupportStatusLabels[socialSupport.status],
          askedAmount: helpRequest.askedAmount?.toString() || '',
          examinationDate: formatDate(
            fileInstruction.examinationDate,
            'DD-MM-YYYY'
          ),
          decisionDate: formatDate(fileInstruction.decisionDate, 'DD-MM-YYYY'),
          allocatedAmount: helpRequest.allocatedAmount?.toString() || '',
          paymentMethod: helpRequest.paymentMethod
            ? paymentMethodLabels[helpRequest.paymentMethod]
            : '',
          paymentDate: formatDate(helpRequest.paymentDate, 'DD-MM-YYYY'),
          handlingDate: formatDate(helpRequest.handlingDate, 'DD-MM-YYYY'),
          refusalReason:
            fileInstruction.refusalReasonOther ||
            (fileInstruction.refusalReason
              ? fileInstructionRefusalReasonLabels[
                  fileInstruction.refusalReason
                ]
              : ''),
          dispatchDate: formatDate(fileInstruction.dispatchDate, 'DD-MM-YYYY'),
          synthesis: socialSupport.synthesis || '',
          dueDate: formatDate(socialSupport.dueDate, 'DD-MM-YYYY'),
          fullFile: getBooleanOrEmpty(fileInstruction.fullFile),
          updated: formatDate(socialSupport.updated, 'DD-MM-YYYY HH:mm'),
          ministre: socialSupport.ministre
            ? ministerLabels[socialSupport.ministre]
            : '',
          numeroPegase: socialSupport.numeroPegase || '',
          createdById: socialSupport.createdBy
            ? formatUserDisplayName(socialSupport.createdBy)
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
