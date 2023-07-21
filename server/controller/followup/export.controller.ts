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

  const EXPORTED_FIELDS: (keyof typeof followupFieldLabels)[] = [
    'id',
    'date',
    'firstFollowup',
    'status',
    'redirected',
    'types',
    'beneficiaryId',
    'medium',
    'classified',
    'documents',
    'dueDate',
    'forwardedToJustice',
    'helpRequested',
    'interventions',
    'ministre',
    'numeroPegase',
    'place',
    'signalements',
    'structureName',
    'synthesis',
    'thirdPersonName',
    'updated',
    'prescribingOrganizationId'
  ]

  const columns = EXPORTED_FIELDS.map(key => ({
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
      prescribingOrganization: true
    }
  })

  const data = dataRequest.reduce((followups: RowType[], followup) => {
    if (canViewFollowup(user, followup.beneficiary)) {
      const withPermissionsFollowup = getFollowupAccessibleData(user, followup)
      followups.push(getFollowupExportData(withPermissionsFollowup))
    }
    return followups
  }, [])

  return await createExport('Entretiens', columns, data, user.id)
}
