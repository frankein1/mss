import type { Prisma } from '@prisma/client'
import { UserRole } from '@prisma/client'
import { getPage } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import type {
  ActiveBeneficiarySocioProfessionalCategory,
  ExportBeneficiariesInput
} from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import {
  beneficiaryFieldLabels,
  supportProgramExportFieldLabels
} from '~/client/labels'
import type {
  GetBeneficiaryOutput,
  GetBeneficiaryRelative
} from '~/types/beneficiary'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryContractTypeKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiaryActivityStatusKeys,
  beneficiarySocioProfessionalCategoryKeys,
  beneficiarySchoolClassKeys,
  beneficiaryStatusKeys,
  beneficiaryStudyLevelKeys,
  pensionOrganisationKeys,
  relativeRelationshipKeys,
  ministereCategorieKeys,
  ministereDepartmentServiceAcKeys,
  ministereStructureKeys,
  familySituationKeys,
  nationalityKeys
} from '~/client/options'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import ExcelPkg from 'exceljs'
import type { Column } from 'exceljs'
import type { RowType } from '~/types/export'

const BENEFICIARY_EXPORTED_FIELDS_COMPLETE: (keyof typeof beneficiaryFieldLabels)[] =
  [
    'usualName',
    'birthName',
    'firstName',
    'birthDate',
    'status',
    'deathDate',
    'gender',
    'nationality',
    'caregiver',
    'accommodationMode',
    'accommodationName',
    'accommodationAdditionalInformation',
    'street',
    'addressComplement',
    'zipcode',
    'city',
    'region',
    'department',
    'district',
    'qpv',
    'accommodationZone',
    'phone1',
    'phone2',
    'email',
    'mobility',
    'familySituation',
    'weddingDate',
    'divorceDate',
    'minorChildren',
    'majorChildren',
    'ministereCategorie',
    'ministereDepartementServiceAc',
    'ministereStructure',
    'socioProfessionalCategory',
    'activityStatus',
    'contractType',
    'occupation',
    'studyLevel',
    'schoolClass',
    'employer',
    'employerSiret',
    'unemploymentNumber',
    'pensionOrganisations',
    'otherPensionOrganisations',
    'cafNumber',
    'additionalInformation',
    'numeroPegase',
    'entourages',
    'subjects',
    'referents',
    'aidantConnectAuthorized',
    'lastActivity',
    'created',
    'fileNumber'
  ]

export const BENEFICIARY_EXPORTED_FIELDS_PARTIAL: (keyof typeof beneficiaryFieldLabels)[] =
  [
    'usualName',
    'birthName',
    'firstName',
    'birthDate',
    'status',
    'gender',
    'accommodationMode',
    'accommodationName',
    'accommodationAdditionalInformation',
    'street',
    'addressComplement',
    'zipcode',
    'city',
    'region',
    'department',
    'phone1',
    'phone2',
    'email',
    'familySituation',
    'minorChildren',
    'majorChildren',
    'subjects',
    'created',
    'fileNumber'
  ]

// NEW
export const exportWorkbook = async ({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportBeneficiariesInput
}) => {
  // 1 get information from db
  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }
  const dataRequest = await getPage(ctx, { where, orderBy: input.orderBy })
  const formatedBeneficiaries = dataRequest.map(({ beneficiary }) =>
    formatData(beneficiary, ctx.user.role)
  )

  // 2 create workbook
  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()
  const worksheet = workbook.addWorksheet('Bénéficiaires')

  const fullColumns = getColumns(ctx.user.role).filter(column => {
    return (formatedBeneficiaries as RowType[]).some(
      row =>
        column.key &&
        !Array.isArray(row) &&
        row[column.key] !== undefined &&
        row[column.key] !== null &&
        row[column.key] !== ''
    )
  }) as Partial<Column>[]
  const includedKeys = new Set(fullColumns.map(c => c.key))
  worksheet.columns = fullColumns
  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }

  formatedBeneficiaries.forEach((beneficiary, index) => {
    const row = worksheet.getRow(index + 2) // header row is 1!
    row.values = beneficiary
    if (includedKeys.has('minorChildren')) {
      row.getCell('minorChildren').numFmt = '0'
    }
    if (includedKeys.has('majorChildren')) {
      row.getCell('majorChildren').numFmt = '0'
    }
    if (includedKeys.has('zipcode')) {
      row.getCell('zipcode').numFmt = '00000'
    }
  })

  return workbook
}

const SUPPORT_PROGRAM_EXPORTED_FIELDS = Object.keys(
  supportProgramExportFieldLabels
) as (keyof typeof supportProgramExportFieldLabels)[]

function getColumns(userRole: UserRole) {
  const baseFields =
    userRole === UserRole.StructureManager
      ? BENEFICIARY_EXPORTED_FIELDS_COMPLETE
      : BENEFICIARY_EXPORTED_FIELDS_PARTIAL
  return [
    ...baseFields.map(key => ({
      key,
      header: beneficiaryFieldLabels[key],
      width: 32
    })),
    ...SUPPORT_PROGRAM_EXPORTED_FIELDS.map(key => ({
      key,
      header: supportProgramExportFieldLabels[key],
      width: 32
    }))
  ]
}

function formatSupportProgramFields(beneficiary: GetBeneficiaryOutput) {
  const supportPrograms =
    beneficiary.externalOrganisations?.supportPrograms ?? []
  const join = (values: (string | null | undefined)[]) =>
    values.filter(Boolean).join(' / ')
  return {
    supportProgramName: join(
      supportPrograms.map(d => d.supportProgramName?.name)
    ),
    supportProgramStartDate: join(
      supportPrograms.map(d =>
        d.startDate ? new Date(d.startDate).toLocaleDateString('fr-FR') : null
      )
    ),
    supportProgramEndDate: join(
      supportPrograms.map(d =>
        d.endDate ? new Date(d.endDate).toLocaleDateString('fr-FR') : null
      )
    ),
    supportProgramExitReason: join(supportPrograms.map(d => d.exitReason)),
    supportProgramPartnerOrganisationName: join(
      supportPrograms.map(d => d.partnerOrganisation?.name)
    ),
    supportProgramPrecisions: join(supportPrograms.map(d => d.precisions))
  }
}

function formatData(beneficiary: GetBeneficiaryOutput, userRole: UserRole) {
  const { general, occupationIncome, taxHouseholds } = beneficiary

  const exported = {
    usualName: general.usualName || '',
    birthName: general.birthName || '',
    firstName: general.firstName || '',
    birthDate: general.birthDate || '',
    status: beneficiaryStatusKeys.byKey[beneficiary.status],
    gender: general.gender ? beneficiaryGenderKeys.byKey[general.gender] : '',
    accommodationMode: general.accommodationMode
      ? beneficiaryAccommodationModeKeys.byKey[general.accommodationMode]
      : '',
    accommodationName: general.accommodationName || '',
    accommodationAdditionalInformation:
      general.accommodationAdditionalInformation || '',
    street: general.street || '',
    addressComplement: general.addressComplement || '',
    zipcode: general.zipcode ? parseInt(general.zipcode) : '',
    city: general.city || '',
    region: general.region || '',
    department: general.department || '',
    phone1: general.phone1 || '',
    phone2: general.phone2 || '',
    email: general.email || '',
    familySituation: taxHouseholds?.familySituation
      ? familySituationKeys.byKey[taxHouseholds.familySituation]
      : '',
    minorChildren: Number(taxHouseholds?.minorChildren) || '',
    majorChildren: Number(taxHouseholds?.majorChildren) || '',
    subjects: beneficiary.history?.subjects.map(s => s.name).join(', ') || '',
    created: beneficiary.created || '',
    fileNumber: beneficiary.fileNumber
  }

  if (userRole !== UserRole.StructureManager) {
    return { ...exported, ...formatSupportProgramFields(beneficiary) }
  }

  return {
    ...exported,
    referents: beneficiary.referents
      .map(referent => formatUserDisplayName(referent))
      .join(', '),
    aidantConnectAuthorized: getBooleanOrEmpty(
      beneficiary.aidantConnectAuthorized
    ),
    deathDate: general.deathDate || '',
    nationality: general.nationality
      ? nationalityKeys.byKey[general.nationality]
      : '',
    district: general.district || '',
    qpv: getBooleanOrEmpty(general.qpv) || '',
    weddingDate: taxHouseholds?.weddingDate || '',
    divorceDate: taxHouseholds?.divorceDate || '',
    caregiver: getBooleanOrEmpty(taxHouseholds?.caregiver),
    mobility: general.mobility
      ? beneficiaryMobilityKeys.byKey[general.mobility]
      : '',
    ministereCategorie: occupationIncome?.ministereCategorie
      ? ministereCategorieKeys.byKey[occupationIncome?.ministereCategorie]
      : '',
    ministereDepartementServiceAc:
      occupationIncome?.ministereDepartementServiceAc
        ? ministereDepartmentServiceAcKeys.byKey[
            occupationIncome?.ministereDepartementServiceAc
          ]
        : '',
    ministereStructure: occupationIncome?.ministereStructure
      ? ministereStructureKeys.byKey[occupationIncome?.ministereStructure]
      : '',
    socioProfessionalCategory: occupationIncome?.socioProfessionalCategory
      ? beneficiarySocioProfessionalCategoryKeys.byKey[
          occupationIncome.socioProfessionalCategory as ActiveBeneficiarySocioProfessionalCategory
        ]
      : '',
    activityStatus: occupationIncome?.activityStatus
      ? occupationIncome.activityStatus
          .map(item => beneficiaryActivityStatusKeys.byKey[item])
          .join(', ')
      : '',
    contractType: occupationIncome?.contractType
      ? beneficiaryContractTypeKeys.byKey[occupationIncome.contractType]
      : '',
    occupation: occupationIncome?.occupation || '',
    studyLevel: occupationIncome?.studyLevel
      ? beneficiaryStudyLevelKeys.byKey[occupationIncome.studyLevel]
      : '',
    schoolClass: occupationIncome?.schoolClass
      ? beneficiarySchoolClassKeys.byKey[occupationIncome.schoolClass]
      : '',
    employer: occupationIncome?.employer || '',
    employerSiret: occupationIncome?.employerSiret || '',
    unemploymentNumber: occupationIncome?.unemploymentNumber || '',
    pensionOrganisations: occupationIncome?.pensionOrganisations
      ? occupationIncome?.pensionOrganisations
          .map(
            pensionOrganisation =>
              pensionOrganisationKeys.byKey[pensionOrganisation]
          )
          .join(', ')
      : '',
    otherPensionOrganisations:
      occupationIncome?.otherPensionOrganisations || '',
    cafNumber: occupationIncome?.cafNumber || '',
    additionalInformation: general.additionalInformation || '',
    numeroPegase: general.numeroPegase || '',
    entourages: beneficiary.entourages?.map(formatRelative).join(', ') || '',
    accommodationZone: general.accommodationZone
      ? beneficiaryAccommodationZoneKeys.byKey[general.accommodationZone]
      : '',
    lastActivity: beneficiary.lastActivity,
    ...formatSupportProgramFields(beneficiary)
  }
}

function formatRelative(relative: GetBeneficiaryRelative) {
  const displayName = formatRelativeName(relative)
  return `${displayName}${
    relative.relationship
      ? ' (' + relativeRelationshipKeys.value(relative.relationship) + ')'
      : ''
  }${relative.phone ? ' tel: ' + relative.phone : ''}`
}

function formatRelativeName(
  beneficiaryRelative: GetBeneficiaryRelative
): string {
  return `${nameOrEmpty(
    beneficiaryRelative.firstName
  )} ${nameOrEmpty(beneficiaryRelative.lastName?.toUpperCase())}`
}
