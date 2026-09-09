import type { Prisma } from '@prisma/client'
import { UserRole } from '@prisma/client'
import { getPage } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import type {
  ActiveBeneficiarySocioProfessionalCategory,
  ExportBeneficiariesInput
} from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import {
  beneficiaryContributingPartnerFieldLabels,
  beneficiaryFieldLabels,
  supportProgramFieldLabels
} from '~~/client/labels'
import type {
  GetBeneficiaryOutput,
  GetBeneficiaryRelative
} from '~~/types/beneficiary'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryContractTypeKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiaryActivityStatusKeys,
  beneficiarySocioProfessionalCategoryKeys,
  beneficiarySchoolClassKeys,
  beneficiarySchoolProgramKeys,
  beneficiaryStatusKeys,
  beneficiaryStudyLevelKeys,
  pensionOrganisationKeys,
  relativeRelationshipKeys,
  ministereCategorieKeys,
  ministereDepartmentServiceAcKeys,
  ministereStructureKeys,
  familySituationKeys,
  nationalityKeys,
  beneficiaryProtectionMeasureKeys,
  beneficiaryOrientationTypeKeys,
  supportProgramOutcomeKeys
} from '~~/client/options'
import type {
  ActiveBeneficiaryMinistereDepartementServiceAc,
  ActiveBeneficiaryMinistereStructure
} from '~~/client/options'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import ExcelPkg from 'exceljs'
import type { Column, Workbook } from 'exceljs'
import type { RowType } from '~~/types/export'

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
    'department',
    'region',
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
    'schoolPrograms',
    'employer',
    'employerSiret',
    'unemploymentNumber',
    'pensionOrganisations',
    'otherPensionOrganisations',
    'cafNumber',
    'additionalInformation',
    'numeroPegase',
    'entourages',
    'prescribingOrganizationId',
    'prescribingOrganizationContactId',
    'protectionMeasure',
    'representative',
    'orientationType',
    'orientationStructure',
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
    'department',
    'region',
    'district',
    'phone1',
    'phone2',
    'email',
    'familySituation',
    'minorChildren',
    'majorChildren',
    'subjects',
    'referents',
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
  const beneficiaries = dataRequest.map(({ beneficiary }) => beneficiary)
  const formatedBeneficiaries = beneficiaries.map(beneficiary =>
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

  // 3 add the contributing partners and support programs worksheets,
  // only available to structure managers
  if (ctx.user.role === UserRole.StructureManager) {
    addContributingPartnersWorksheet(workbook, beneficiaries)
    addSupportProgramsWorksheet(workbook, beneficiaries)
  }

  return workbook
}

const CONTRIBUTING_PARTNER_EXPORTED_COLUMNS = [
  { key: 'beneficiaryFileNumber', header: beneficiaryFieldLabels.fileNumber },
  {
    key: 'partnerOrganizationName',
    header: beneficiaryContributingPartnerFieldLabels.partnerOrganizationId
  },
  {
    key: 'partnerOrganizationContactName',
    header:
      beneficiaryContributingPartnerFieldLabels.partnerOrganizationContactId
  },
  {
    key: 'precisions',
    header: beneficiaryContributingPartnerFieldLabels.precisions
  }
]

const addContributingPartnersWorksheet = (
  workbook: Workbook,
  beneficiaries: GetBeneficiaryOutput[]
) => {
  const worksheet = workbook.addWorksheet('Partenaires intervenants')
  worksheet.columns = CONTRIBUTING_PARTNER_EXPORTED_COLUMNS.map(column => ({
    ...column,
    width: 32
  }))
  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }

  beneficiaries.forEach(beneficiary => {
    const contributingPartners =
      beneficiary.externalOrganisations?.contributingPartners ?? []
    contributingPartners.forEach(contributingPartner => {
      worksheet.addRow({
        beneficiaryFileNumber: beneficiary.fileNumber,
        partnerOrganizationName: contributingPartner.partnerOrganization.name,
        partnerOrganizationContactName:
          contributingPartner.partnerOrganizationContact?.name || '',
        precisions: contributingPartner.precisions || ''
      })
    })
  })
}

const SUPPORT_PROGRAM_EXPORTED_COLUMNS = [
  { key: 'beneficiaryFileNumber', header: beneficiaryFieldLabels.fileNumber },
  { key: 'name', header: supportProgramFieldLabels.name },
  {
    key: 'partnerOrganisations',
    header: supportProgramFieldLabels.partnerOrganisationIds
  },
  { key: 'startDate', header: supportProgramFieldLabels.startDate },
  { key: 'endDate', header: supportProgramFieldLabels.endDate },
  { key: 'outcome', header: supportProgramFieldLabels.outcome }
]

const addSupportProgramsWorksheet = (
  workbook: Workbook,
  beneficiaries: GetBeneficiaryOutput[]
) => {
  const worksheet = workbook.addWorksheet('Dispositifs')
  worksheet.columns = SUPPORT_PROGRAM_EXPORTED_COLUMNS.map(column => ({
    ...column,
    width: 32
  }))
  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }

  beneficiaries.forEach(beneficiary => {
    const supportPrograms = beneficiary.supportPrograms ?? []
    supportPrograms.forEach(supportProgram => {
      worksheet.addRow({
        beneficiaryFileNumber: beneficiary.fileNumber,
        name: supportProgram.supportProgramName.name,
        partnerOrganisations: supportProgram.partnerOrganisations
          .map(partnerOrganisation => partnerOrganisation.name)
          .join(' / '),
        startDate: supportProgram.startDate || '',
        endDate: supportProgram.endDate || '',
        outcome: supportProgram.outcome
          ? supportProgramOutcomeKeys.byKey[supportProgram.outcome]
          : ''
      })
    })
  })
}

function getColumns(userRole: UserRole) {
  const baseFields =
    userRole === UserRole.StructureManager
      ? BENEFICIARY_EXPORTED_FIELDS_COMPLETE
      : BENEFICIARY_EXPORTED_FIELDS_PARTIAL
  return baseFields.map(key => ({
    key,
    header: beneficiaryFieldLabels[key],
    width: 32
  }))
}

function formatData(beneficiary: GetBeneficiaryOutput, userRole: UserRole) {
  const { general, occupationIncome, taxHouseholds, externalOrganisations } =
    beneficiary

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
    district: general.district || '',
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

  const referents = beneficiary.referents
    .map(referent => formatUserDisplayName(referent))
    .join(', ')

  if (userRole !== UserRole.StructureManager) {
    return {
      ...exported,
      referents
    }
  }

  return {
    ...exported,
    referents,
    aidantConnectAuthorized: getBooleanOrEmpty(
      beneficiary.aidantConnectAuthorized
    ),
    deathDate: general.deathDate || '',
    nationality: general.nationality
      ? nationalityKeys.byKey[general.nationality]
      : '',
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
            occupationIncome?.ministereDepartementServiceAc as ActiveBeneficiaryMinistereDepartementServiceAc
          ]
        : '',
    ministereStructure: occupationIncome?.ministereStructure
      ? ministereStructureKeys.byKey[
          occupationIncome?.ministereStructure as ActiveBeneficiaryMinistereStructure
        ]
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
    schoolPrograms: occupationIncome?.schoolPrograms
      ? occupationIncome.schoolPrograms
          .map(item => beneficiarySchoolProgramKeys.byKey[item])
          .join(', ')
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
    protectionMeasure: externalOrganisations?.protectionMeasure
      ? beneficiaryProtectionMeasureKeys.byKey[
          externalOrganisations.protectionMeasure
        ]
      : '',
    representative: externalOrganisations?.representative || '',
    prescribingOrganizationId:
      externalOrganisations?.prescribingOrganization?.name || '',
    prescribingOrganizationContactId:
      externalOrganisations?.prescribingOrganizationContact?.name || '',
    orientationType: externalOrganisations?.orientationType
      ? beneficiaryOrientationTypeKeys.byKey[
          externalOrganisations.orientationType
        ]
      : '',
    orientationStructure: externalOrganisations?.orientationStructure || ''
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
