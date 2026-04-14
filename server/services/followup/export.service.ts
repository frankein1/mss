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
import {
  followupFieldLabels,
  beneficiaryExportFieldLabels
} from '~/client/labels'
import { formatMinisterName } from '~/utils/minister'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import { redirectionExportLabels } from '~/client/labels/redirection.labels'
import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
import ExcelPkg from 'exceljs'
import type { Column } from 'exceljs'
import { EXPORT_DEFAULT_FONT } from '~/utils/constants/export'

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
  const orderBy = prepareSort(input.orderBy)

  const dataRequest = await getPage(ctx, { where, orderBy })

  const rows = dataRequest.reduce(
    (followups: RowType[], { permissions, followup }) => {
      if (permissions.view) {
        const redirections = followup.socialSupportRedirections || []
        followups.push({
          date: followup.date ?? null,
          firstFollowup: getBooleanOrEmpty(followup.firstFollowup),
          status: socialSupportStatusKeys.value(followup.status) || '',
          subjects: followup.subjects.map(({ name }) => name).join(', '),
          beneficiaryFileNumber: followup.beneficiary.fileNumber || '',
          beneficiaryLastName: nameOrEmpty(
            followup.beneficiary.usualName?.toLocaleUpperCase() ||
              (followup.beneficiary.birthName
                ? `(${followup.beneficiary.birthName?.toLocaleUpperCase()})`
                : '')
          ),
          beneficiaryFirstName: nameOrEmpty(followup.beneficiary.firstName),
          medium: followupMediumKeys.value(followup.medium) || '',
          classified: getBooleanOrEmpty(followup.classified),
          documents:
            followup.documents?.map(document => document.name).join(', ') || '',
          dueDate: followup.dueDate ?? null,
          forwardedToJustice: getBooleanOrEmpty(followup.forwardedToJustice),
          helpRequested: getBooleanOrEmpty(followup.helpRequested),
          minister: followup.minister
            ? formatMinisterName(followup.minister)
            : '',
          numeroPegase: followup.numeroPegase || '',
          place: followup.place || '',
          prescribingOrganizationId:
            followup.prescribingOrganization?.name || '',
          synthesis: followup.synthesis || '',
          thirdPersonName: followup.thirdPersonName || '',
          // Technically it should be converted into timezone of the user
          updated: followup.updated ?? null,
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

export async function exportWorkbook({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFollowupsInput
}) {
  const { rows, columns } = await exportFollowups({ ctx, input })

  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()
  const worksheet = workbook.addWorksheet('Entretiens')

  const fullColumns = columns.filter(column => {
    return rows.some(
      row =>
        column.key &&
        !Array.isArray(row) &&
        row[column.key] !== undefined &&
        row[column.key] !== null &&
        row[column.key] !== ''
    )
  }) as Partial<Column>[]

  const DATE_COLUMN_FORMATS: Record<string, string> = {
    date: 'dd/mm/yyyy',
    dueDate: 'dd/mm/yyyy',
    updated: 'dd/mm/yyyy hh:mm'
  }

  worksheet.columns = fullColumns
  worksheet.columns.forEach(sheetColumn => {
    sheetColumn.font = EXPORT_DEFAULT_FONT
    sheetColumn.width = 30
    if (sheetColumn.key && sheetColumn.key in DATE_COLUMN_FORMATS) {
      sheetColumn.numFmt = DATE_COLUMN_FORMATS[sheetColumn.key]
    }
  })
  worksheet.getRow(1).font = { ...EXPORT_DEFAULT_FONT, bold: true }

  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }

  rows.forEach(row => {
    const newRow = worksheet.addRow(row)
    if ((row as RowType).bold) {
      newRow.font = { bold: true }
    }
  })

  return workbook
}
