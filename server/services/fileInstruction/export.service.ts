import { prepareFilters, prepareSort } from './helper'
import { getPage } from './queries'
import {
  helpRequestFieldLabels,
  housingHelpRequestFieldLabels,
  beneficiaryExportFieldLabels
} from '~/client/labels'
import type { ExportFileInstructionsInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getFileInstructionPermissions } from '~/server/security'
import type { RowType } from '~/types/export'
import { formatUserDisplayName } from '~/utils/user'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import {
  socialSupportStatusKeys,
  fileInstructionRefusalReasonKeys,
  paymentMethodKeys,
  askedHousingKeys,
  housingReasonKeys,
  housingTypeKeys,
  roomCountKeys,
  lowIncomeHousingKeys
} from '~/client/options'
import { formatMinisterName } from '~/utils/minister'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import { redirectionExportLabels } from '~/client/labels/redirection.labels'
import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
import ExcelPkg from 'exceljs'
import type { Column } from 'exceljs'
import { EXPORT_DEFAULT_FONT } from '~/utils/constants/export'

const exportLabels = {
  ...helpRequestFieldLabels,
  ...beneficiaryExportFieldLabels
}

const FIELDS: (keyof typeof exportLabels)[] = [
  'status',
  'date',
  'isFirst',
  'beneficiaryFileNumber',
  'beneficiaryLastName',
  'beneficiaryFirstName',
  'financialSupport',
  'subjectId',
  'examinationDate',
  'decisionDate',
  'prescribingOrganizationId',
  'synthesis',
  'externalStructure',
  'dispatchDate',
  'instructorOrganizationId',
  'askedAmount',
  'allocatedAmount',
  'paymentMethod',
  'paymentDate',
  'documents',
  'handlingDate',
  'refusalReason',
  'refusalReasonOther',
  'dueDate',
  'fullFile',
  'updated',
  'minister',
  'numeroPegase',
  'createdById'
]

const HOUSING_FIELDS: (keyof typeof housingHelpRequestFieldLabels)[] = [
  'askedHousing',
  'reason',
  'taxHouseholdAdditionalInformation',
  'maxRent',
  'maxCharges',
  'housingType',
  'roomCount',
  'lowIncomeHousingType',
  'isPmr'
]

const REDIRECTION_EXPORTED_FIELDS: (keyof typeof redirectionExportLabels)[] = [
  'type',
  'motif',
  'partnerOrganizationId',
  'partnerOrganizationContactId',
  'externalStructureName'
]

export async function exportFileInstructions({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFileInstructionsInput
}) {
  const columns = [
    ...FIELDS.map(key => ({
      key,
      header: exportLabels[key]
    })),
    ...HOUSING_FIELDS.map(key => ({
      key,
      header: housingHelpRequestFieldLabels[key]
    })),
    ...REDIRECTION_EXPORTED_FIELDS.map(key => ({
      key,
      header: redirectionExportLabels[key]
    }))
  ]

  const where = prepareFilters(input.filters)
  const orderBy = prepareSort(input.orderBy)

  const fileInstructions = await getPage(ctx, {
    where,
    orderBy
  })

  const rows = fileInstructions.reduce(
    (fileInstructions: RowType[], fileInstruction) => {
      const { socialSupport, helpRequest, housingHelpRequest } = fileInstruction
      const { familyFile, beneficiary } = socialSupport
      const permissions = getFileInstructionPermissions({
        ctx,
        familyFile,
        socialSupport
      })
      if (!permissions.view) {
        return fileInstructions
      }
      // File instructions have 1 sss but in the model a social support
      // can be linked to several sss.
      const subjectId = socialSupport.subjects?.[0]?.name || ''
      const redirections = socialSupport.socialSupportRedirections || []
      return [
        ...fileInstructions,
        {
          beneficiaryFileNumber: beneficiary.fileNumber || '',
          beneficiaryLastName: nameOrEmpty(
            beneficiary.usualName?.toLocaleUpperCase() ||
              (beneficiary.birthName
                ? `(${beneficiary.birthName?.toLocaleUpperCase()})`
                : '')
          ),
          beneficiaryFirstName: nameOrEmpty(beneficiary.firstName),
          financialSupport: getBooleanOrEmpty(helpRequest?.financialSupport),
          prescribingOrganizationId:
            helpRequest?.prescribingOrganization?.name ||
            housingHelpRequest?.prescribingOrganization?.name ||
            '',
          externalStructure: getExternalStructure(
            fileInstruction.externalStructure
          ),
          instructorOrganizationId:
            fileInstruction.instructorOrganization?.name || '',
          date: socialSupport.date ?? null,
          subjectId,
          documents:
            socialSupport.documents
              ?.map(document => document.name)
              .join(', ') || '',
          status: socialSupportStatusKeys.value(socialSupport.status) || '',
          isFirst: getIsFirst(housingHelpRequest?.isFirst),
          askedAmount: helpRequest?.askedAmount?.toNumber() ?? null,
          examinationDate: fileInstruction.examinationDate ?? null,
          decisionDate: fileInstruction.decisionDate ?? null,
          allocatedAmount: helpRequest?.allocatedAmount?.toNumber() ?? null,
          paymentMethod:
            paymentMethodKeys.value(helpRequest?.paymentMethod) || '',
          paymentDate: helpRequest?.paymentDate ?? null,
          handlingDate: helpRequest?.handlingDate ?? null,
          refusalReason:
            fileInstruction.refusalReasonOther ||
            fileInstructionRefusalReasonKeys.value(
              fileInstruction.refusalReason
            ) ||
            '',
          dispatchDate: fileInstruction.dispatchDate ?? null,
          synthesis: socialSupport.synthesis || '',
          dueDate: socialSupport.dueDate ?? null,
          fullFile: getBooleanOrEmpty(fileInstruction.fullFile),
          // Ideally it should be converted into timezone of the user
          updated: socialSupport.updated ?? null,
          minister: socialSupport.minister
            ? formatMinisterName(socialSupport.minister)
            : '',
          numeroPegase: socialSupport.numeroPegase || '',
          createdById: socialSupport.createdBy
            ? formatUserDisplayName(socialSupport.createdBy)
            : '',
          askedHousing:
            (housingHelpRequest?.askedHousing || [])
              .map(ah => askedHousingKeys.value(ah))
              .join(', ') || '',
          reason: housingReasonKeys.value(housingHelpRequest?.reason) || '',
          taxHouseholdAdditionalInformation:
            housingHelpRequest?.taxHouseholdAdditionalInformation || '',
          maxRent: housingHelpRequest?.maxRent?.toNumber() ?? null,
          maxCharges: housingHelpRequest?.maxCharges?.toNumber() ?? null,
          housingType:
            (housingHelpRequest?.housingType || [])
              .map(ht => housingTypeKeys.value(ht))
              .join(', ') || '',
          roomCount:
            (housingHelpRequest?.roomCount || [])
              .map(rc => roomCountKeys.value(rc))
              .join(', ') || '',
          lowIncomeHousingType:
            (housingHelpRequest?.lowIncomeHousingType || [])
              .map(li => lowIncomeHousingKeys.value(li))
              .join(', ') || '',
          isPmr: getBooleanOrEmpty(housingHelpRequest?.isPmr),
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
        }
      ]
    },
    []
  )

  return { rows, columns }
}

function getExternalStructure(externalStructure: boolean | null | undefined) {
  if (externalStructure === true) {
    return 'Organisation extérieure'
  }
  if (externalStructure === false) {
    return 'Interne'
  }
  return ''
}

function getIsFirst(isFirst: boolean | null | undefined) {
  if (isFirst === true) {
    return '1ère demande'
  }
  if (isFirst === false) {
    return 'Renouvellement'
  }
  return ''
}

const DATE_COLUMN_FORMATS: Record<string, string> = {
  date: 'dd/mm/yyyy',
  examinationDate: 'dd/mm/yyyy',
  decisionDate: 'dd/mm/yyyy',
  paymentDate: 'dd/mm/yyyy',
  handlingDate: 'dd/mm/yyyy',
  dispatchDate: 'dd/mm/yyyy',
  dueDate: 'dd/mm/yyyy',
  updated: 'dd/mm/yyyy hh:mm'
}

const CURRENCY_COLUMNS = new Set([
  'askedAmount',
  'allocatedAmount',
  'maxRent',
  'maxCharges'
])

export async function exportWorkbook({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportFileInstructionsInput
}) {
  const { rows, columns } = await exportFileInstructions({ ctx, input })

  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()
  const worksheet = workbook.addWorksheet('Instructions de dossier')

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

  worksheet.columns = fullColumns
  worksheet.columns.forEach(sheetColumn => {
    sheetColumn.font = EXPORT_DEFAULT_FONT
    sheetColumn.width = 30
    if (sheetColumn.key && sheetColumn.key in DATE_COLUMN_FORMATS) {
      sheetColumn.numFmt = DATE_COLUMN_FORMATS[sheetColumn.key]
    } else if (sheetColumn.key && CURRENCY_COLUMNS.has(sheetColumn.key)) {
      sheetColumn.numFmt = '#,##0.00" €"'
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
