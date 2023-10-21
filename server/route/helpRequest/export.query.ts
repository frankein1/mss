import {
  getHelpRequestAccessibleData,
  getHelpRequestExportData
} from './helper'
import { createQuery } from '~/server/route'
import { helpRequestFieldLabels } from '~/client/labels'
import {
  ExportHelpRequestsInput,
  exportHelpRequestsSchema
} from '~/server/schema'
import {
  canViewHelpRequest,
  canExportHistory,
  SecurityRuleGrantee
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { prepareHelpRequestFilters } from '~/utils/filters'
import { HELP_REQUEST_EXPORTED_FIELDS } from '~/utils/constants/export'
import { HelpRequestRepo } from '~/server/database'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: ExportHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  const columns = HELP_REQUEST_EXPORTED_FIELDS.map(key => ({
    key,
    header: helpRequestFieldLabels[key]
  }))

  const where = prepareHelpRequestFilters(input.filters)

  const dataRequest = await HelpRequestRepo.findMany(user, {
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
