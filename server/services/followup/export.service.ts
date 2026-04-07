import { getPage } from './queries'
import { prepareFilters, prepareSort } from './helper'
import {
  followupMediumKeys,
  socialSupportStatusKeys,
  followupDurationKeys
} from '~/client/options'
import type { ExportFollowupsInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import type { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'
import {
  followupFieldLabels,
  beneficiaryExportFieldLabels
} from '~/client/labels'
import { formatMinisterName } from '~/utils/minister'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import { redirectionExportLabels } from '~/client/labels/redirection.labels'
import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'

const exportLabels = { ...followupFieldLabels, ...beneficiaryExportFieldLabels }

const FOLLOWUP_EXPORTED_FIELDS: (keyof typeof exportLabels)[] = [
  'status',
  'date',
  'beneficiaryFileNumber',
  'beneficiaryLastName',
  'beneficiaryFirstName',
  'numeroPegase',
  'minister',
  'subjects',
  'medium',
  'prescribingOrganizationId',
  'firstFollowup',
  'synthesis',
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
const REDIRECTION_EXPORTED_FIELDS: (keyof typeof redirectionExportLabels)[] = [
  'type',
  'motif',
  'partnerOrganizationId',
  'partnerOrganizationContactId',
  'externalStructureName'
]

export async function exportFollowups({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFollowupsInput
}) {
  const columns = [
    ...FOLLOWUP_EXPORTED_FIELDS.map(key => ({
      key,
      header: exportLabels[key]
    })),
    ...REDIRECTION_EXPORTED_FIELDS.map(key => ({
      key,
      header: redirectionExportLabels[key]
    }))
  ]

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const dataRequest = await getPage(ctx, { where, orderBy })

  const rows = dataRequest.reduce(
    (followups: RowType[], { permissions, followup }) => {
      if (permissions.view) {
        const redirections = followup.socialSupportRedirections || []
        followups.push({
          date: formatDate(followup.date, 'DD-MM-YYYY'),
          firstFollowup: getBooleanOrEmpty(followup.firstFollowup),
          status: socialSupportStatusKeys.value(followup.status) || '',
          subjects: followup.subjects.map(({ name }) => name).join(', '),
          beneficiaryFileNumber: followup.beneficiary.fileNumber || '',
          beneficiaryLastName: nameOrEmpty(
            followup.beneficiary.usualName || followup.beneficiary.birthName
          ),
          beneficiaryFirstName: nameOrEmpty(followup.beneficiary.firstName),
          medium: followupMediumKeys.value(followup.medium) || '',
          classified: getBooleanOrEmpty(followup.classified),
          documents:
            followup.documents?.map(document => document.name).join(', ') || '',
          dueDate: formatDate(followup.dueDate, 'DD-MM-YYYY'),
          forwardedToJustice: getBooleanOrEmpty(followup.forwardedToJustice),
          helpRequested: getBooleanOrEmpty(followup.helpRequested),
          minister: followup.minister
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
          duration: followupDurationKeys.value(followup.duration) || '',
          type: redirections
            .map(r => socialSupportRedirectionTypeKeys.value(r.type))
            .filter((type): type is string => type != null)
            .join(', '),
          motif: redirections
            .map(r => r.motif)
            .filter((motif): motif is string => motif != null)
            .join(', '),
          partnerOrganizationId: redirections
            .map(r => r.partnerOrganization.name)
            .filter((name): name is string => name != null)
            .join(', '),
          partnerOrganizationContactId: redirections
            .map(r => r.partnerOrganizationContact.name)
            .filter((name): name is string => name != null)
            .join(', '),
          externalStructureName: redirections
            .map(r => r.externalStructureName)
            .filter((name): name is string => name != null)
            .join(', ')
        })
      }
      return followups
    },
    []
  )
  return { rows, columns }
}
