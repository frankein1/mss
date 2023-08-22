import { Prisma } from '@prisma/client'
import { helpRequestFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import { ExportHelpRequestsInput } from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewHelpRequest
} from '~/server/security/rules'
import { canExportHistory } from '~/server/security/rules/export'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import {
  prepareHelpRequestFilters,
  getHelpRequestAccessibleData
} from '~/utils/helpRequest'
import { getHelpRequestExportData } from '~/utils/export/getHelpRequestExportData'
import { HELP_REQUEST_EXPORTED_FIELDS } from '~/utils/constants/export'

export const exportHelpRequestsHandler = async ({
  input,
  ctx: { user }
}: {
  input: ExportHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  if (!canExportHistory(user)) {
    throw forbiddenError()
  }

  const columns = HELP_REQUEST_EXPORTED_FIELDS.map(key => ({
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
