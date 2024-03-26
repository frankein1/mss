import { Document, Prisma } from '@prisma/client'
import { getPage } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import { ExportBeneficiariesInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'
import { beneficiaryFieldLabels } from '~/client/labels'
import { DocumentRepo } from '~/server/database'
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
  incomeSourceKeys,
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

export const BENEFICIARY_EXPORTED_FIELDS: (keyof typeof beneficiaryFieldLabels)[] =
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
    'accommodationZone',
    'phone1',
    'phone2',
    'email',
    'mobility',
    'familySituation',
    'minorChildren',
    'majorChildren',
    'taxHouseholds',
    'ministereCategorie',
    'ministereDepartementServiceAc',
    'ministereStructure',
    'socioProfessionalCategory',
    'occupation',
    'employer',
    'employerSiret',
    'mainIncomeSource',
    'mainIncomeAmount',
    'partnerMainIncomeSource',
    'partnerMainIncomeAmount',
    'majorChildrenMainIncomeSource',
    'majorChildrenMainIncomeAmount',
    'unemploymentNumber',
    'pensionOrganisations',
    'otherPensionOrganisations',
    'cafNumber',
    'bank',
    'funeralContract',
    'additionalInformation',
    'numeroPegase',
    'entourages',
    'documents',
    'historyTotal',
    'subjects',
    'referents',
    'aidantConnectAuthorized',
    'updated',
    'fileNumber'
  ]

export async function exportBeneficiaries({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: ExportBeneficiariesInput
}) {
  const columns = BENEFICIARY_EXPORTED_FIELDS.map(key => ({
    key,
    header: beneficiaryFieldLabels[key]
  }))

  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }

  const dataRequest = await getPage(ctx, { where, orderBy: input.orderBy })

  const rows: RowType[] = []

  for (const { beneficiary } of dataRequest) {
    const documents = await DocumentRepo.findMany(ctx.user, {
      where: { beneficiaryId: beneficiary.id }
    })

    rows.push(formatData(beneficiary, documents))
  }

  return { columns, rows }
}

function formatData(beneficiary: GetBeneficiaryOutput, documents: Document[]) {
  const { general, occupationIncome, taxHouseholds, history } = beneficiary
  return {
    referents: beneficiary.referents
      .map(referent => formatUserDisplayName(referent))
      .join(', '),
    aidantConnectAuthorized: getBooleanOrEmpty(
      beneficiary.aidantConnectAuthorized
    ),
    fileNumber: readableFileNumber(beneficiary.id),
    status: beneficiaryStatusKeys.byKey[beneficiary.status],
    usualName: general.usualName || '',
    birthName: general.birthName || '',
    firstName: general.firstName || '',
    birthDate: formatDate(general.birthDate, 'DD-MM-YYYY'),
    deathDate: formatDate(general.deathDate, 'DD-MM-YYYY'),
    gender: general.gender ? beneficiaryGenderKeys.byKey[general.gender] : '',
    nationality: general.nationality
      ? nationalityKeys.byKey[general.nationality]
      : '',
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
    caregiver: getBooleanOrEmpty(taxHouseholds?.caregiver),
    minorChildren: taxHouseholds?.minorChildren?.toString() || '',
    majorChildren: taxHouseholds?.majorChildren?.toString() || '',
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
    occupation: occupationIncome?.occupation || '',
    employer: occupationIncome?.employer || '',
    employerSiret: occupationIncome?.employerSiret || '',
    mainIncomeSource: occupationIncome?.mainIncomeSource
      ? occupationIncome?.mainIncomeSource
          .map(incomeSource => incomeSourceKeys.byKey[incomeSource])
          .join(', ')
      : '',
    mainIncomeAmount: occupationIncome?.mainIncomeAmount?.toString() || '',
    partnerMainIncomeSource: occupationIncome?.partnerMainIncomeSource
      ? occupationIncome?.partnerMainIncomeSource
          .map(incomeSource => incomeSourceKeys.byKey[incomeSource])
          .join(', ')
      : '',
    partnerMainIncomeAmount:
      occupationIncome?.partnerMainIncomeAmount?.toString() || '',
    majorChildrenMainIncomeSource:
      occupationIncome?.majorChildrenMainIncomeSource
        ? occupationIncome?.majorChildrenMainIncomeSource
            .map(incomeSource => incomeSourceKeys.byKey[incomeSource])
            .join(', ')
        : '',
    majorChildrenMainIncomeAmount:
      occupationIncome?.majorChildrenMainIncomeAmount?.toString() || '',
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
    bank: occupationIncome?.bank || '',
    funeralContract: occupationIncome?.funeralContract || '',
    additionalInformation: general.additionalInformation || '',
    numeroPegase: general.numeroPegase || '',
    accommodationZone: general.accommodationZone
      ? beneficiaryAccommodationZoneKeys.byKey[general.accommodationZone]
      : '',
    updated: formatDate(beneficiary.updated, 'DD-MM-YYYY HH:mm'),
    entourages: beneficiary.entourages?.map(formatRelative).join(', ') || '',
    taxHouseholds:
      (taxHouseholds?.taxHouseholds || []).map(formatRelative).join(', ') || '',
    documents: documents.map(document => document.name).join(', '),
    historyTotal: history.historyTotal.toString(),
    subjects: history.subjects.map(({ name }) => name).join(', ')
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
