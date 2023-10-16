import { Prisma } from '@prisma/client'
import { getFollowupAccessibleData } from './helper/getFollowupAccessibleData'
import { createQuery } from '~/server/route'
import { followupFieldLabels } from '~/client/labels'
import { ExportFollowupsInput, exportFollowupsSchema } from '~/server/schema'
import {
  canViewFollowup,
  canExportHistory,
  SecurityRuleGrantee
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { prepareFollowupFilters } from '~/utils/filters'
import { getFollowupExportData } from '~/server/route/followup/helper/getFollowupExportData'
import { FOLLOWUP_EXPORTED_FIELDS } from '~/utils/constants/export'
import { FollowupRepo } from '~/server/repository'

const handler = async ({
  input,
  ctx: { user }
}: {
  input: ExportFollowupsInput
  ctx: ProtectedAppContext
}) => {
  const columns = FOLLOWUP_EXPORTED_FIELDS.map(key => ({
    key,
    header: followupFieldLabels[key]
  }))

  const where: Prisma.FollowupWhereInput = {
    ...prepareFollowupFilters(input.filters)
  }

  const dataRequest = await FollowupRepo.findMany(user, {
    where,
    orderBy: input.orderBy,
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      types: true,
      prescribingOrganization: true,
      createdBy: true
    }
  })

  const rows = dataRequest.reduce((followups: RowType[], followup) => {
    if (canViewFollowup(user, followup.beneficiary)) {
      const withPermissionsFollowup = getFollowupAccessibleData(user, followup)
      followups.push(getFollowupExportData(withPermissionsFollowup))
    }
    return followups
  }, [])

  return await createExport(user.id, [{ name: 'Entretiens', columns, rows }])
}

const securityCheck = (
  user: SecurityRuleGrantee,
  _input: ExportFollowupsInput
) => {
  return canExportHistory(user)
}

export const exportFollowupsQuery = createQuery({
  inputValidation: exportFollowupsSchema,
  securityCheck,
  handler
})
