import type { Prisma } from '@prisma/client'
import { UserRole } from '@prisma/client'
import { getPage } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import type { ExportBeneficiariesInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { beneficiaryFieldLabels } from '~/client/labels'
import type {
  GetBeneficiaryOutput,
  GetBeneficiaryRelative
} from '~/types/beneficiary'
import {
  beneficiaryAccommodationModeKeys,
  beneficiaryAccommodationZoneKeys,
  beneficiaryGenderKeys,
  beneficiaryMobilityKeys,
  beneficiarySocioProfessionalCategoryKeys,
  beneficiaryStatusKeys,
  pensionOrganisationKeys,
  relativeRelationshipKeys,
  ministereCategorieKeys,
  ministereDepartmentServiceAcKeys,
  ministereStructureKeys,
  familySituationKeys,
  nationalityKeys
} from '~/client/options'
import { readableFileNumber } from '~/utils/readableFileNumber'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import ExcelPkg from 'exceljs'

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
    'schoolName',
    'isSchoolInQPV',
    'occupation',
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
  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()
  const worksheet = workbook.addWorksheet('Bénéficiaires')
  worksheet.columns = getColumns(ctx.user.role)
  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount }
  }

  formatedBeneficiaries.forEach((beneficiary, index) => {
    const row = worksheet.getRow(index + 2) // header row is 1!
    row.values = beneficiary
    // format numbers
    row.getCell('minorChildren').numFmt = '0'
    row.getCell('majorChildren').numFmt = '0'
    row.getCell('zipcode').numFmt = '00000'
  })

  return workbook
}

function getColumns(userRole: UserRole) {
  return userRole === UserRole.StructureManager
    ? BENEFICIARY_EXPORTED_FIELDS_COMPLETE.map(key => ({
        key,
        header: beneficiaryFieldLabels[key],
        width: 32
      }))
    : BENEFICIARY_EXPORTED_FIELDS_PARTIAL.map(key => ({
        key,
        header: beneficiaryFieldLabels[key],
        width: 32
      }))
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
    created: beneficiary.created || '',
    fileNumber: readableFileNumber(beneficiary.id)
  }

  if (userRole !== UserRole.StructureManager) {
    return exported
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
          occupationIncome.socioProfessionalCategory
        ]
      : '',
    schoolName: occupationIncome?.schoolName ?? '',
    isSchoolInQPV: getBooleanOrEmpty(occupationIncome?.isSchoolInQPV),
    occupation: occupationIncome?.occupation || '',
    studyLevel: occupationIncome?.studyLevel || '',
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
    lastActivity: beneficiary.lastActivity
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
