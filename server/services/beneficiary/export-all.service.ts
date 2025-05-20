import { Prisma, UserRole } from '@prisma/client'
import { getPage } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import { ExportBeneficiariesInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'
import { beneficiaryFieldLabels } from '~/client/labels'
import {
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
    'updated',
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
    'subjects'
  ]

export async function exportAll({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportBeneficiariesInput
}) {
  const columns = getColumns(ctx.user.role)

  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }

  const dataRequest = await getPage(ctx, { where, orderBy: input.orderBy })

  const rows: RowType[] = []

  for (const { beneficiary } of dataRequest) {
    rows.push(formatData(beneficiary, ctx.user.role))
  }

  return { columns, rows }
}

function getColumns(userRole: UserRole) {
  return userRole === UserRole.StructureManager
    ? BENEFICIARY_EXPORTED_FIELDS_COMPLETE.map(key => ({
        key,
        header: beneficiaryFieldLabels[key]
      }))
    : BENEFICIARY_EXPORTED_FIELDS_PARTIAL.map(key => ({
        key,
        header: beneficiaryFieldLabels[key]
      }))
}

function formatData(beneficiary: GetBeneficiaryOutput, userRole: UserRole) {
  const { general, occupationIncome, taxHouseholds } = beneficiary

  const exported = {
    usualName: general.usualName || '',
    birthName: general.birthName || '',
    firstName: general.firstName || '',
    birthDate: formatDate(general.birthDate, 'DD/MM/YYYY'),
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
    zipcode: general.zipcode || '',
    city: general.city || '',
    region: general.region || '',
    department: general.department || '',
    phone1: general.phone1 || '',
    phone2: general.phone2 || '',
    email: general.email || '',
    familySituation: taxHouseholds?.familySituation
      ? familySituationKeys.byKey[taxHouseholds.familySituation]
      : '',
    minorChildren: taxHouseholds?.minorChildren?.toString() || '',
    majorChildren: taxHouseholds?.majorChildren?.toString() || ''
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
    fileNumber: readableFileNumber(beneficiary.id),
    deathDate: formatDate(general.deathDate, 'DD-MM-YYYY'),
    nationality: general.nationality
      ? nationalityKeys.byKey[general.nationality]
      : '',
    qpv: getBooleanOrEmpty(general.qpv) || '',
    weddingDate: formatDate(taxHouseholds?.weddingDate, 'DD-MM-YYYY'),
    divorceDate: formatDate(taxHouseholds?.divorceDate, 'DD-MM-YYYY'),
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
    // Ideally it should be converted into timezone of the user
    updated: formatDate(beneficiary.updated, 'DD-MM-YYYY HH:mm')
  }
}

function formatRelative(relative: GetBeneficiaryRelative) {
  const displayName = formatRelativeName(relative)
  if (relative.relationship) {
    return `${displayName} (${relativeRelationshipKeys.value(
      relative.relationship
    )})`
  }
  return displayName
}

function formatRelativeName(
  beneficiaryRelative: GetBeneficiaryRelative
): string {
  return `${nameOrEmpty(
    beneficiaryRelative.firstName
  )} ${beneficiaryRelative.lastName?.toUpperCase()}`
}
