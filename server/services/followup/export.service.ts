import { Prisma } from '@prisma/client'
import { getPage } from './queries'
import { prepareFollowupFilters } from './helper'
import {
  followupMediumLabels,
  followupStatusLabels
} from '~/client/options/followup'
import { ExportFollowupsInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { ministerLabels } from '~/client/options/ministry'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
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

  const dataRequest = await getPage(user, { where, orderBy: input.orderBy })

  const rows = dataRequest.reduce(
    (followups: RowType[], { permissions, followup }) => {
      if (permissions.view) {
        followups.push({
          date: formatDate(followup.date, 'DD-MM-YYYY'),
          firstFollowup: getBooleanOrEmpty(followup.firstFollowup),
          status: followupStatusLabels[followup.status],
          redirected: getBooleanOrEmpty(followup.redirected),
          types: followup.types.map(type => type.name).join(', '),
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
          prescribingOrganizationId:
            followup.prescribingOrganization?.name || '',
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
    },
    []
  )
  return { rows, columns }
}
