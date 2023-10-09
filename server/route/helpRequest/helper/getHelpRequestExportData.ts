import { getUserDisplayName } from '~/utils/user'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import {
  helpRequestReasonLabels,
  helpRequestStatusLabels,
  paymentMethodLabels
} from '~/client/options/helpRequest'
import { ministerLabels } from '~/client/options/ministry'
import { getHelpRequestAccessibleData } from '~/server/route/helpRequest/helper/getHelpRequestAccessibleData'

function getExternalStructure(externalStructure: boolean | null | undefined) {
  if (externalStructure === true) {
    return 'Organisation extérieure'
  }
  if (externalStructure === false) {
    return 'Interne'
  }
  return ''
}

export function getHelpRequestExportData(
  helpRequest: ReturnType<typeof getHelpRequestAccessibleData>
) {
  return {
    beneficiaryId: formatBeneficiaryDisplayName(helpRequest.beneficiary),
    prescribingOrganizationId: helpRequest.prescribingOrganization?.name || '',
    externalStructure: getExternalStructure(helpRequest.externalStructure),
    instructorOrganizationId: helpRequest.instructorOrganization?.name || '',
    openingDate: formatDate(helpRequest.openingDate, 'DD-MM-YYYY'),
    typeId: helpRequest.type.name,
    documents:
      helpRequest.documents?.map(document => document.name).join(', ') || '',
    financialSupport: getBooleanOrEmpty(helpRequest.financialSupport),
    status: helpRequestStatusLabels[helpRequest.status],
    askedAmount: helpRequest.askedAmount?.toString() || '',
    examinationDate: formatDate(helpRequest.examinationDate, 'DD-MM-YYYY'),
    decisionDate: formatDate(helpRequest.decisionDate, 'DD-MM-YYYY'),
    allocatedAmount: helpRequest.allocatedAmount?.toString() || '',
    paymentMethod: helpRequest.paymentMethod
      ? paymentMethodLabels[helpRequest.paymentMethod]
      : '',
    paymentDate: formatDate(helpRequest.paymentDate, 'DD-MM-YYYY'),
    handlingDate: formatDate(helpRequest.handlingDate, 'DD-MM-YYYY'),
    refusalReason: helpRequest.refusalReason || '',
    dispatchDate: formatDate(helpRequest.dispatchDate, 'DD-MM-YYYY'),
    synthesis: helpRequest.synthesis || '',
    dueDate: formatDate(helpRequest.dueDate, 'DD-MM-YYYY'),
    fullFile: getBooleanOrEmpty(helpRequest.fullFile),
    reason: helpRequest.reason
      ? helpRequestReasonLabels[helpRequest.reason]
      : '',
    updated: formatDate(helpRequest.updated, 'DD-MM-YYYY HH:mm'),
    ministre: helpRequest.ministre ? ministerLabels[helpRequest.ministre] : '',
    numeroPegase: helpRequest.numeroPegase || '',
    createdById: helpRequest.createdBy
      ? getUserDisplayName(helpRequest.createdBy)
      : ''
  }
}
