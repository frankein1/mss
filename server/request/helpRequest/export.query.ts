import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/request'
import { helpRequestFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import {
  ExportHelpRequestsInput,
  exportHelpRequestsSchema
} from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewHelpRequest,
  canExportHistory,
  SecurityRuleGrantee
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { getHelpRequestAccessibleData } from '~/utils/helpRequest'
import { prepareHelpRequestFilters } from '~/utils/filters'
import { getHelpRequestExportData } from '~/utils/export/getHelpRequestExportData'
import { HELP_REQUEST_EXPORTED_FIELDS } from '~/utils/constants/export'

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: ExportHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  const columns = HELP_REQUEST_EXPORTED_FIELDS.map(key => ({
    key,
    header: helpRequestFieldLabels[key]
  }))

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.HelpRequestWhereInput = {
    structureId: structure.id,
    beneficiary: {
      archived: null,
      referents
    },
    ...prepareHelpRequestFilters(
      input.filters,
      canOnlyListItsBeneficiaries(user)
    )
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
      type: true,
      createdBy: true
    },
    orderBy: input.orderBy
  })

  const rows = dataRequest.reduce((helpRequests: RowType[], helpRequest) => {
    if (canViewHelpRequest(user, helpRequest.beneficiary)) {
      const withPermissionsHelpRequest = getHelpRequestAccessibleData(
        user,
        helpRequest
      )
      helpRequests.push(getHelpRequestExportData(withPermissionsHelpRequest))
    }
    return helpRequests
  }, [])

  return await createExport(user.id, [
    { name: "Demandes d'aide", columns, rows }
  ])
}

const securityCheck = (
  user: SecurityRuleGrantee,
  _input: ExportHelpRequestsInput
) => {
  return canExportHistory(user)
}

export const exportHelpRequestQuery = createQuery({
  securityCheck,
  handler,
  inputValidation: exportHelpRequestsSchema
})
