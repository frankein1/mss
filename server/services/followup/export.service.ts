import { getPage } from './queries'
import { prepareFilters, prepareSort } from './helper'
import {
  followupMediumKeys,
  socialSupportStatusKeys,
  ministerKeys,
  followupDurationKeys
} from '~/client/options'
import type { ExportFollowupsInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import type { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'
import { followupFieldLabels } from '~/client/labels'
import { formatBeneficiaryDisplayName } from '~/utils'
import { formatMinisterName } from '~/utils/minister'

export const FOLLOWUP_EXPORTED_FIELDS: (keyof typeof followupFieldLabels)[] = [
  'status',
  'date',
  'beneficiaryId',
  'numeroPegase',
  'ministre',
  'subjects',
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
  'place',
  'thirdPersonName',
  'updated',
  'createdById',
  'duration'
]

export async function exportFollowups({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFollowupsInput
}) {
  const columns = FOLLOWUP_EXPORTED_FIELDS.map(key => ({
    key,
    header: followupFieldLabels[key]
  }))

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const dataRequest = await getPage(ctx, { where, orderBy })

  const rows = dataRequest.reduce(
    (followups: RowType[], { permissions, followup }) => {
      if (permissions.view) {
        followups.push({
          date: formatDate(followup.date, 'DD-MM-YYYY'),
          firstFollowup: getBooleanOrEmpty(followup.firstFollowup),
          status: socialSupportStatusKeys.value(followup.status) || '',
          redirected: getBooleanOrEmpty(followup.redirected),
          subjects: followup.subjects.map(({ name }) => name).join(', '),
          beneficiaryId: formatBeneficiaryDisplayName(followup.beneficiary),
          medium: followupMediumKeys.value(followup.medium) || '',
          classified: getBooleanOrEmpty(followup.classified),
          documents:
            followup.documents?.map(document => document.name).join(', ') || '',
          dueDate: formatDate(followup.dueDate, 'DD-MM-YYYY'),
          forwardedToJustice: getBooleanOrEmpty(followup.forwardedToJustice),
          helpRequested: getBooleanOrEmpty(followup.helpRequested),
          ministre: followup.minister
            ? formatMinisterName(followup.minister)
            : '',
          numeroPegase: followup.numeroPegase || '',
          place: followup.place || '',
          prescribingOrganizationId:
            followup.prescribingOrganization?.name || '',
          structureName: followup.structureName || '',
          synthesis: followup.synthesis || '',
          thirdPersonName: followup.thirdPersonName || '',
          // Technically it should be converted into timezone of the user
          updated: formatDate(followup.updated, 'DD-MM-YYYY HH:mm'),
          createdById: followup.createdBy
            ? formatUserDisplayName(followup.createdBy)
            : '',
          duration: followupDurationKeys.value(followup.duration) || ''
        })
      }
      return followups
    },
    []
  )
  return { rows, columns }
}
