import { Document, Prisma } from '@prisma/client'
import { getPage } from './queries'
import { prepareBeneficiaryFilters } from './helper'
import { ExportBeneficiariesInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { RowType } from '~/types/export'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatUserDisplayName } from '~/utils/user'
import { formatDate } from '~/utils/formatDate'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
import { beneficiaryFieldLabels } from '~/client/labels'
import { DocumentRepo } from '~/server/database'
import {
  GetBeneficiaryOutput,
  GetBeneficiaryRelative
} from '~/types/beneficiary'
import {
  beneficiaryAccommodationModeLabels,
  beneficiaryAccommodationZoneLabels,
  beneficiaryGenderLabels,
  beneficiaryMobilityLabels,
  beneficiarySocioProfessionalCategoryLabels,
  beneficiaryStatusLabels,
  incomeSourceLabels,
  pensionOrganisationLabels,
  relativeRelationshipLabels
} from '~/client/options/beneficiary'
import {
  ministereCategorieLabels,
  ministereDepartmentServiceAcLabels,
  ministereStructureLabels
} from '~/client/options/ministry'
import { familySituationLabels } from '~/client/options/familySituation'
import { Nationalities } from '~/client/options/nationality'
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
    'types',
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
    status: beneficiaryStatusLabels[beneficiary.status],
    usualName: general.usualName || '',
    birthName: general.birthName || '',
    firstName: general.firstName || '',
    birthDate: formatDate(general.birthDate, 'DD-MM-YYYY'),
    deathDate: formatDate(general.deathDate, 'DD-MM-YYYY'),
    gender: general.gender ? beneficiaryGenderLabels[general.gender] : '',
    nationality: general.nationality ? Nationalities[general.nationality] : '',
    accommodationMode: general.accommodationMode
      ? beneficiaryAccommodationModeLabels[general.accommodationMode]
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
      ? familySituationLabels[taxHouseholds.familySituation]
      : '',
    caregiver: getBooleanOrEmpty(taxHouseholds?.caregiver),
    minorChildren: taxHouseholds?.minorChildren?.toString() || '',
    majorChildren: taxHouseholds?.majorChildren?.toString() || '',
    mobility: general.mobility
      ? beneficiaryMobilityLabels[general.mobility]
      : '',
    ministereCategorie: occupationIncome?.ministereCategorie
      ? ministereCategorieLabels[occupationIncome?.ministereCategorie]
      : '',
    ministereDepartementServiceAc:
      occupationIncome?.ministereDepartementServiceAc
        ? ministereDepartmentServiceAcLabels[
            occupationIncome?.ministereDepartementServiceAc
          ]
        : '',
    ministereStructure: occupationIncome?.ministereStructure
      ? ministereStructureLabels[occupationIncome?.ministereStructure]
      : '',
    socioProfessionalCategory: occupationIncome?.socioProfessionalCategory
      ? beneficiarySocioProfessionalCategoryLabels[
          occupationIncome.socioProfessionalCategory
        ]
      : '',
    occupation: occupationIncome?.occupation || '',
    employer: occupationIncome?.employer || '',
    employerSiret: occupationIncome?.employerSiret || '',
    mainIncomeSource: occupationIncome?.mainIncomeSource
      ? occupationIncome?.mainIncomeSource
          .map(incomeSource => incomeSourceLabels[incomeSource])
          .join(', ')
      : '',
    mainIncomeAmount: occupationIncome?.mainIncomeAmount?.toString() || '',
    partnerMainIncomeSource: occupationIncome?.partnerMainIncomeSource
      ? occupationIncome?.partnerMainIncomeSource
          .map(incomeSource => incomeSourceLabels[incomeSource])
          .join(', ')
      : '',
    partnerMainIncomeAmount:
      occupationIncome?.partnerMainIncomeAmount?.toString() || '',
    majorChildrenMainIncomeSource:
      occupationIncome?.majorChildrenMainIncomeSource
        ? occupationIncome?.majorChildrenMainIncomeSource
            .map(incomeSource => incomeSourceLabels[incomeSource])
            .join(', ')
        : '',
    majorChildrenMainIncomeAmount:
      occupationIncome?.majorChildrenMainIncomeAmount?.toString() || '',
    unemploymentNumber: occupationIncome?.unemploymentNumber || '',
    pensionOrganisations: occupationIncome?.pensionOrganisations
      ? occupationIncome?.pensionOrganisations
          .map(
            pensionOrganisation =>
              pensionOrganisationLabels[pensionOrganisation]
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
      ? beneficiaryAccommodationZoneLabels[general.accommodationZone]
      : '',
    updated: formatDate(beneficiary.updated, 'DD-MM-YYYY HH:mm'),
    entourages: beneficiary.entourages?.map(formatRelative).join(', ') || '',
    taxHouseholds:
      (taxHouseholds?.taxHouseholds || []).map(formatRelative).join(', ') || '',
    documents: documents.map(document => document.name).join(', '),
    historyTotal: history.historyTotal.toString(),
    types: history.types.map(({ name }) => name).join(', ')
  }
}

function formatRelative(relative: GetBeneficiaryRelative) {
  const displayName = formatRelativeName(relative)
  if (relative.relationship) {
    return `${displayName} (${
      relativeRelationshipLabels[relative.relationship]
    })`
  }
  return displayName
}

function formatRelativeName(
  beneficiaryRelative: GetBeneficiaryRelative
): string {
  if (beneficiaryRelative.linkedBeneficiary) {
    return formatBeneficiaryDisplayName(beneficiaryRelative.linkedBeneficiary)
  }
  return `${nameOrEmpty(
    beneficiaryRelative.firstName
  )} ${beneficiaryRelative.lastName?.toUpperCase()}`
}
