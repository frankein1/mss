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
  getAppContextPermissions,
  getHelpRequestPermissions,
  SecurityRuleContext
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { prepareHelpRequestFilters } from '~/utils/filters'
import { HELP_REQUEST_EXPORTED_FIELDS } from '~/utils/constants/export'
import { HelpRequestRepo } from '~/server/database'

const handler = async ({
  input,
  ctx
}: {
  input: ExportHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx
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
    const permissions = getHelpRequestPermissions({
      ctx,
      target: helpRequest
    })

    if (permissions.view) {
      const withPermissionsHelpRequest = getHelpRequestAccessibleData(
        permissions,
        helpRequest
      )
      helpRequests.push(getHelpRequestExportData(withPermissionsHelpRequest))
    }
    return helpRequests
  }, [])

  return await createExport(user.id, [
    { name: 'Instructions de dossier', columns, rows }
  ])
}

const securityCheck = (
  ctx: SecurityRuleContext,
  _input: ExportHelpRequestsInput
) => {
  return getAppContextPermissions(ctx).export.history
}

export const exportHelpRequestQuery = createQuery({
  securityCheck,
  handler,
  inputValidation: exportHelpRequestsSchema
})
