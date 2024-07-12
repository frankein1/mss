import { prepareFilters, prepareSort } from './helper'
import { getPage } from './queries'
import { helpRequestFieldLabels } from '~/client/labels'
import { ExportFileInstructionsInput } from '~/server/schema'
import {
  SecurityRuleContext,
  getFileInstructionPermissions
} from '~/server/security'
import { RowType } from '~/types/export'
import { formatUserDisplayName } from '~/utils/user'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import {
  socialSupportStatusKeys,
  fileInstructionRefusalReasonKeys,
  paymentMethodKeys,
  ministerKeys
} from '~/client/options'
import { formatBeneficiaryDisplayName } from '~/utils'

export const FIELDS: (keyof typeof helpRequestFieldLabels)[] = [
  'status',
  'date',
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

export async function exportFileInstructions({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFileInstructionsInput
}) {
  const columns = FIELDS.map(key => ({
    key,
    header: helpRequestFieldLabels[key]
  }))

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const fileInstructions = await getPage(ctx, {
    where,
    orderBy
  })

  const rows = fileInstructions.reduce(
    (fileInstructions: RowType[], fileInstruction) => {
      const { socialSupport, helpRequest } = fileInstruction
      const { familyFile, beneficiary } = socialSupport
      const permissions = getFileInstructionPermissions({
        ctx,
        familyFile,
        socialSupport
      })
      if (!permissions.view) {
        return fileInstructions
      }
      const subjectId =
        socialSupport?.subjects?.length > 0
          ? socialSupport.subjects[0].name
          : ''

      return [
        ...fileInstructions,
        {
          familyFileId: formatBeneficiaryDisplayName(beneficiary),
          financialSupport: helpRequest?.financialSupport || '',
          prescribingOrganizationId:
            helpRequest?.prescribingOrganization?.name || '',
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
          updated: formatDate(socialSupport.updated, 'DD-MM-YYYY HH:mm'),
          ministre: socialSupport.ministre
            ? ministerKeys.byKey[socialSupport.ministre]
            : '',
          numeroPegase: socialSupport.numeroPegase || '',
          createdById: socialSupport.createdBy
            ? formatUserDisplayName(socialSupport.createdBy)
            : ''
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
