import { Prisma } from '@prisma/client'
import { followupFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import { ExportFollowupsInput } from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewFollowup
} from '~/server/security/rules'
import { forbiddenError, ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { prepareFollowupFilters } from '~/utils/filters'
import { getFollowupAccessibleData } from '~/utils/followup'
import { canExportHistory } from '~/server/security/rules/export'
import { getFollowupExportData } from '~/utils/export/getFollowupExportData'
import { FOLLOWUP_EXPORTED_FIELDS } from '~/utils/constants/export'

export const exportFollowupsHandler = async ({
  input,
  ctx: { user }
}: {
  input: ExportFollowupsInput
  ctx: ProtectedAppContext
}) => {
  if (!canExportHistory(user)) {
    throw forbiddenError()
  }

  const columns = FOLLOWUP_EXPORTED_FIELDS.map(key => ({
    key,
    header: followupFieldLabels[key]
  }))

  const referents = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.FollowupWhereInput = {
    structureId: user.structureId,
    beneficiary: {
      archived: null,
      referents
    },
    ...prepareFollowupFilters(input.filters)
  }

  const dataRequest = await prismaClient.followup.findMany({
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
