import { Prisma } from '@prisma/client'
import { followupFieldLabels } from '~/client/labels'
import {
  followupInterventionLabels,
  followupMediumLabels,
  followupSignalementLabels,
  followupStatusLabels
} from '~/client/options/followup'
import { prismaClient } from '~/server/prisma'
import { ExportFollowupsInput } from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewFollowup
} from '~/server/security/rules'
import { forbiddenError, ProtectedAppContext } from '~/server/trpc'
import { getBeneficiaryDisplayName } from '~/utils/beneficiary/getBeneficiaryDisplayName'
import { RowType } from '~/types/export'
import { createExport } from '~/utils/export/createExport'
import { prepareFollowupFilters } from '~/utils/filters'
import { getFollowupAccessibleData } from '~/utils/followup'
import { formatDate } from '~/utils/formatDate'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { ministerLabels } from '~/client/options/ministry'
import { canExportHistory } from '~/server/security/rules/export'

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
    if (followup && canViewFollowup(user, followup.beneficiary)) {
      const withPermissionsFollowup = getFollowupAccessibleData(user, followup)
      followups.push({
        id: withPermissionsFollowup.id,
        date: formatDate(withPermissionsFollowup.date, 'DD-MM-YYYY'),
        firstFollowup: getBooleanOrEmpty(withPermissionsFollowup.firstFollowup),
        status: followupStatusLabels[withPermissionsFollowup.status],
        redirected: getBooleanOrEmpty(withPermissionsFollowup.redirected),
        types: withPermissionsFollowup.types.map(type => type.name).join(','),
        beneficiaryId: getBeneficiaryDisplayName(
          withPermissionsFollowup.beneficiary
        ),
        medium: withPermissionsFollowup.medium
          ? followupMediumLabels[withPermissionsFollowup.medium]
          : '',
        classified: getBooleanOrEmpty(withPermissionsFollowup.classified),
        documents:
          withPermissionsFollowup.documents
            ?.map(document => document.name)
            .join(',') || '',
        dueDate: formatDate(withPermissionsFollowup.dueDate, 'DD-MM-YYYY'),
        forwardedToJustice: getBooleanOrEmpty(
          withPermissionsFollowup.forwardedToJustice
        ),
        helpRequested: getBooleanOrEmpty(withPermissionsFollowup.helpRequested),
        interventions: withPermissionsFollowup.interventions
          ? withPermissionsFollowup.interventions
              .map(intervention => followupInterventionLabels[intervention])
              .join(',')
          : '',
        ministre: withPermissionsFollowup.ministre
          ? ministerLabels[withPermissionsFollowup.ministre]
          : '',
        numeroPegase: withPermissionsFollowup.numeroPegase || '',
        place: withPermissionsFollowup.place || '',
        prescribingOrganizationId:
          withPermissionsFollowup.prescribingOrganization?.name || '',
        // TODO: export comments, depending on structures' feedbacks
        signalements: withPermissionsFollowup.signalements
          ? withPermissionsFollowup.signalements
              .map(signalement => followupSignalementLabels[signalement])
              .join(',')
          : '',
        structureName: withPermissionsFollowup.structureName || '',
        synthesis: withPermissionsFollowup.synthesis || '',
        thirdPersonName: withPermissionsFollowup.thirdPersonName || '',
        updated: formatDate(withPermissionsFollowup.updated, 'DD-MM-YYYY HH:mm')
      })
    }
    return followups
  }, [])

  return await createExport('Entretiens', columns, data, user.id)
}
