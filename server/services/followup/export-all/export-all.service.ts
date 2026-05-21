import {
  followupFieldLabels,
  beneficiaryExportFieldLabels
} from '~/client/labels'
import { redirectionExportLabels } from '~/client/labels/redirection.labels'
import {
  followupMediumKeys,
  socialSupportStatusKeys,
  followupDurationKeys
} from '~/client/options'
import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
import type { ExportFollowupsInput } from '~/server/schema'
import {
  getAppContextPermissions,
  getFollowupPermissions,
  type SecurityRuleContext
} from '~/server/security'
import { prepareFilters } from '../helper'
import {
  MinisterRepo,
  PartnerOrganizationRepo,
  UserRepo
} from '~/server/database'
import {
  filterFollowupForExport,
  filterSocialSupportForExport
} from '../../helper'
import { findAllForExport, type ExportFollowupResult } from './export-all.query'
import type { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { formatMinisterName } from '~/utils/minister'
import { nameOrEmpty } from '~/utils/nameOrEmpty'

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

  const [followups, users, partners, ministers] = await Promise.all([
    findAllForExport(ctx.user, where),
    UserRepo.findMany(ctx.user, {
      select: { id: true /*, firstName: true, lastName: true*/ }
    }),
    PartnerOrganizationRepo.findMany(ctx.user, {
      select: {
        id: true,
        name: true,
        contacts: { select: { id: true, name: true } }
      }
    }),
    MinisterRepo.findMany(ctx.user, {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        function: true,
        government: true
      }
    })
  ])

  const userMap = new Map(users.map(u => [u.id, u]))
  const partnerMap = new Map(partners.map(p => [p.id, p]))
  const contactMap = new Map(
    partners.flatMap(p => p.contacts.map(c => [c.id, c] as const))
  )
  const ministerMap = new Map(ministers.map(m => [m.id, m]))

  const appPermissions = getAppContextPermissions(ctx)

  const rows: RowType[] = []

  for (const followup of followups) {
    const { socialSupport } = followup

    const permissions = getFollowupPermissions({
      ctx,
      familyFile: {
        structureId: ctx.structure.id,
        referents: socialSupport.familyFile.referents
      },
      socialSupport: {
        structureId: ctx.structure.id,
        createdById: socialSupport.createdById
      }
    })

    if (!permissions.view) {
      continue
    }

    const conditions = {
      details: permissions.get.details,
      dueDate: permissions.get.dueDate,
      minister: appPermissions.module.ministere
    }

    const filtered = {
      ...filterSocialSupportForExport({ socialSupport, conditions }),
      ...filterFollowupForExport({ followup, conditions }),
      documents: socialSupport.documents
    }

    rows.push(
      formatRow(filtered, { userMap, partnerMap, contactMap, ministerMap })
    )
  }

  return { rows, columns }
}

type LookupMaps = {
  userMap: Map<string, { id: string; firstName: string; lastName: string }>
  partnerMap: Map<string, { id: string; name: string }>
  contactMap: Map<string, { id: string; name: string }>
  ministerMap: Map<
    string,
    {
      id: string
      firstName: string
      lastName: string
      function: string
      government: string
    }
  >
}

type FilteredFollowup = ReturnType<typeof filterSocialSupportForExport> &
  ReturnType<typeof filterFollowupForExport> & {
    documents: ExportFollowupResult['socialSupport']['documents']
  }

function formatRow(filtered: FilteredFollowup, maps: LookupMaps): RowType {
  const minister = filtered.ministerId
    ? maps.ministerMap.get(filtered.ministerId)
    : undefined
  const createdBy = filtered.createdById
    ? maps.userMap.get(filtered.createdById)
    : undefined
  const prescribingOrg = filtered.prescribingOrganizationId
    ? maps.partnerMap.get(filtered.prescribingOrganizationId)
    : undefined
  const redirections = filtered.socialSupportRedirections || []

  return {
    date: filtered.date || '',
    firstFollowup: getBooleanOrEmpty(filtered.firstFollowup),
    status: socialSupportStatusKeys.value(filtered.status) || '',
    subjects: filtered.subjects.map(s => s.name).join(', '),
    beneficiaryFileNumber: filtered.beneficiary.fileNumber || '',
    beneficiaryLastName: nameOrEmpty(
      filtered.beneficiary.usualName?.toLocaleUpperCase() ||
        (filtered.beneficiary.birthName
          ? `(${filtered.beneficiary.birthName?.toLocaleUpperCase()})`
          : '')
    ),
    beneficiaryFirstName: nameOrEmpty(filtered.beneficiary.firstName),
    medium: followupMediumKeys.value(filtered.medium) || '',
    classified: getBooleanOrEmpty(filtered.classified),
    documents:
      filtered.documents?.map(document => document.name).join(', ') || '',
    dueDate: filtered.dueDate || '',
    forwardedToJustice: getBooleanOrEmpty(filtered.forwardedToJustice),
    helpRequested: getBooleanOrEmpty(filtered.helpRequested),
    minister: minister ? formatMinisterName(minister) : '',
    numeroPegase: filtered.numeroPegase || '',
    place: filtered.place || '',
    prescribingOrganizationId: prescribingOrg?.name || '',
    synthesis: filtered.synthesis || '',
    thirdPersonName: filtered.thirdPersonName || '',
    updated: filtered.updated || '',
    createdById: createdBy ? formatUserDisplayName(createdBy) : '',
    duration: followupDurationKeys.value(filtered.duration) || '',
    type: redirections
      .map(r => socialSupportRedirectionTypeKeys.value(r.type))
      .filter((type): type is string => type != null)
      .join(', '),
    motif: redirections
      .map(r => r.motif)
      .filter((motif): motif is string => motif != null)
      .join(', '),
    partnerOrganizationId: redirections
      .map(r =>
        r.partnerOrganizationId
          ? maps.partnerMap.get(r.partnerOrganizationId)?.name
          : null
      )
      .filter((name): name is string => name != null)
      .join(', '),
    partnerOrganizationContactId: redirections
      .map(r =>
        r.partnerOrganizationContactId
          ? maps.contactMap.get(r.partnerOrganizationContactId)?.name
          : null
      )
      .filter((name): name is string => name != null)
      .join(', '),
    externalStructureName: redirections
      .map(r => r.externalStructureName)
      .filter((name): name is string => name != null)
      .join(', ')
  }
}
