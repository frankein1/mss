import { Prisma } from '@prisma/client'
import { helpRequestFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import { ExportHelpRequestsInput } from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewHelpRequest
} from '~/server/security/rules'
import { canExport } from '~/server/security/rules/export'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { getBeneficiaryDisplayName } from '~/utils/beneficiary/getBeneficiaryDisplayName'
import {
  prepareHelpRequestFilters,
  getHelpRequestAccessibleData
} from '~/utils/helpRequest'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import {
  helpRequestReasonLabels,
  helpRequestStatusLabels,
  paymentMethodLabels
} from '~/client/options/helpRequest'
import { ministerLabels } from '~/client/options/ministry'

export const exportHelpRequestsHandler = async ({
  input,
  ctx: { user }
}: {
  input: ExportHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  if (!canExport(user)) {
    throw forbiddenError()
  }

  const EXPORTED_FIELDS: (keyof typeof helpRequestFieldLabels)[] = [
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

  const columns = EXPORTED_FIELDS.map(key => ({
    key,
    header: helpRequestFieldLabels[key]
  }))

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.HelpRequestWhereInput = {
    structureId: user.structureId,
    beneficiary: {
      archived: null,
      referents
    },
    ...prepareHelpRequestFilters(input.filters)
  }

  const dataRequest = await prismaClient.helpRequest.findMany({
    where,
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      prescribingOrganization: true,
      instructorOrganization: true,
      type: true
    },
    orderBy: input.orderBy
  })

  const data = dataRequest.reduce((helpRequests: RowType[], helpRequest) => {
    if (helpRequest && canViewHelpRequest(user, helpRequest.beneficiary)) {
      const withPermissionsHelpRequest = getHelpRequestAccessibleData(
        user,
        helpRequest
      )
      helpRequests.push({
        id: withPermissionsHelpRequest.id,
        beneficiaryId: getBeneficiaryDisplayName(
          withPermissionsHelpRequest.beneficiary
        ),
        prescribingOrganizationId:
          withPermissionsHelpRequest.prescribingOrganization?.name || '',
        externalStructure: getBooleanOrEmpty(
          withPermissionsHelpRequest.externalStructure
        ),
        instructorOrganizationId:
          withPermissionsHelpRequest.instructorOrganization?.name || '',
        openingDate: formatDate(
          withPermissionsHelpRequest.openingDate,
          'DD-MM-YYYY'
        ),
        typeId: withPermissionsHelpRequest.type.name,
        documents:
          withPermissionsHelpRequest.documents
            ?.map(document => document.name)
            .join(',') || '',
        financialSupport: getBooleanOrEmpty(
          withPermissionsHelpRequest.financialSupport
        ),
        status: helpRequestStatusLabels[withPermissionsHelpRequest.status],
        askedAmount: withPermissionsHelpRequest.askedAmount?.toString() || '',
        examinationDate: formatDate(
          withPermissionsHelpRequest.examinationDate,
          'DD-MM-YYYY'
        ),
        decisionDate: formatDate(
          withPermissionsHelpRequest.decisionDate,
          'DD-MM-YYYY'
        ),
        allocatedAmount:
          withPermissionsHelpRequest.allocatedAmount?.toString() || '',
        paymentMethod: withPermissionsHelpRequest.paymentMethod
          ? paymentMethodLabels[withPermissionsHelpRequest.paymentMethod]
          : '',
        paymentDate: formatDate(
          withPermissionsHelpRequest.paymentDate,
          'DD-MM-YYYY'
        ),
        handlingDate: formatDate(
          withPermissionsHelpRequest.handlingDate,
          'DD-MM-YYYY'
        ),
        refusalReason: withPermissionsHelpRequest.refusalReason || '',
        dispatchDate: formatDate(
          withPermissionsHelpRequest.dispatchDate,
          'DD-MM-YYYY'
        ),
        synthesis: withPermissionsHelpRequest.synthesis || '',
        dueDate: formatDate(withPermissionsHelpRequest.dueDate, 'DD-MM-YYYY'),
        fullFile: getBooleanOrEmpty(withPermissionsHelpRequest.fullFile),
        reason: withPermissionsHelpRequest.reason
          ? helpRequestReasonLabels[withPermissionsHelpRequest.reason]
          : '',
        updated: formatDate(
          withPermissionsHelpRequest.updated,
          'DD-MM-YYYY HH:mm'
        ),
        ministre: withPermissionsHelpRequest.ministre
          ? ministerLabels[withPermissionsHelpRequest.ministre]
          : '',
        numeroPegase: withPermissionsHelpRequest.numeroPegase || ''
      })
    }
    return helpRequests
  }, [])

  return await createExport("Demandes d'aide", columns, data, user.id)
}
