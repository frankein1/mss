import { Prisma } from '@prisma/client'
import { filter } from './get.service'
import {
  followupMediumLabels,
  followupStatusLabels
} from '~/client/options/followup'
import { FollowupRepo } from '~/server/database'
import { ExportFollowupsInput } from '~/server/schema'
import { SecurityRuleGrantee, getFollowupPermissions } from '~/server/security'
import { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { ministerLabels } from '~/client/options/ministry'
import { formatUserDisplayName } from '~/utils/user'
import { prepareFollowupFilters } from '~/utils/filters'
import { followupFieldLabels } from '~/client/labels'

export const FOLLOWUP_EXPORTED_FIELDS: (keyof typeof followupFieldLabels)[] = [
  'status',
  'date',
  'beneficiaryId',
  'numeroPegase',
  'ministre',
  'types',
  'medium',
  'prescribingOrganizationId',
  'firstFollowup',
  'synthesis',
  'redirected',
  'structureName',
  'classified',
  'documents',
  'dueDate',
  'forwardedToJustice',
  'helpRequested',
  // 'interventions',
  'place',
  // 'signalements',
  'thirdPersonName',
  'updated',
  'createdById'
]

export async function exportFollowups({
  user,
  input
}: {
  user: SecurityRuleGrantee
  input: ExportFollowupsInput
}) {
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
    const permissions = getFollowupPermissions({
      user,
      beneficiary: followup.beneficiary,
      followup
    })
    if (permissions.select) {
      const filteredFu = filter(user, followup)
      followups.push({
        date: formatDate(filteredFu.date, 'DD-MM-YYYY'),
        firstFollowup: getBooleanOrEmpty(filteredFu.firstFollowup),
        status: followupStatusLabels[filteredFu.status],
        redirected: getBooleanOrEmpty(filteredFu.redirected),
        types: filteredFu.types.map(type => type.name).join(', '),
        beneficiaryId: formatBeneficiaryDisplayName(followup.beneficiary),
        medium: followup.medium ? followupMediumLabels[followup.medium] : '',
        classified: getBooleanOrEmpty(followup.classified),
        documents:
          followup.documents?.map(document => document.name).join(', ') || '',
        dueDate: formatDate(followup.dueDate, 'DD-MM-YYYY'),
        forwardedToJustice: getBooleanOrEmpty(followup.forwardedToJustice),
        helpRequested: getBooleanOrEmpty(followup.helpRequested),
        // interventions: followup.interventions
        //   ? followup.interventions
        //       .map(intervention => followupInterventionLabels[intervention])
        //       .join(', ')
        //   : '',
        ministre: followup.ministre ? ministerLabels[followup.ministre] : '',
        numeroPegase: followup.numeroPegase || '',
        place: followup.place || '',
        prescribingOrganizationId: followup.prescribingOrganization?.name || '',
        // signalements: followup.signalements
        //   ? followup.signalements
        //       .map(signalement => followupSignalementLabels[signalement])
        //       .join(', ')
        //   : '',
        structureName: followup.structureName || '',
        synthesis: followup.synthesis || '',
        thirdPersonName: followup.thirdPersonName || '',
        updated: formatDate(followup.updated, 'DD-MM-YYYY HH:mm'),
        createdById: followup.createdBy
          ? formatUserDisplayName(followup.createdBy)
          : ''
      })
    }
    return followups
  }, [])
  return { rows, columns }
}
