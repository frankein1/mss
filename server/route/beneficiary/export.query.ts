import { Document, Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { beneficiaryFieldLabels } from '~/client/labels'
import {
  ExportBeneficiariesInput,
  exportBeneficiariesSchema
} from '~/server/schema'
import { canExportBeneficiaries, SecurityRuleGrantee } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { BENEFICIARY_EXPORTED_FIELDS } from '~/utils/constants/export'
import { createExport } from '~/utils/export/createExport'
import { prepareBeneficiaryFilters } from '~/utils/filters'
import { findBeneficiaries } from '~/server/query'
import { formatUserDisplayName } from '~/utils/user'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
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
import { Nationalities } from '~/client/options/nationality'
import { familySituationLabels } from '~/client/options/familySituation'
import {
  ministereCategorieLabels,
  ministereDepartmentServiceAcLabels,
  ministereStructureLabels
} from '~/client/options/ministry'
import {
  GetBeneficiaryOutput,
  GetBeneficiaryRelative
} from '~/types/beneficiary'
import { DocumentRepo } from '~/server/database'

const securityCheck = (
  grantee: SecurityRuleGrantee,
  _input: ExportBeneficiariesInput
) => {
  return canExportBeneficiaries(grantee)
}

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  const columns = BENEFICIARY_EXPORTED_FIELDS.map(key => ({
    key,
    header: beneficiaryFieldLabels[key]
  }))

  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }

  const dataRequest = await findBeneficiaries({
    user: ctx.user,
    structure: ctx.structure,
    where,
    orderBy: input.orderBy
  })

  const rows: RowType[] = []

  for (const beneficiary of dataRequest) {
    const documents = await DocumentRepo.findMany(ctx.user, {
      where: { beneficiaryId: beneficiary.id }
    })

    rows.push(formatData(beneficiary, documents))
  }

  return await createExport(ctx.user.id, [
    { name: 'Bénéficiaires', columns, rows }
  ])
}

export const exportBeneficiariesQuery = createQuery({
  inputValidation: exportBeneficiariesSchema,
  securityCheck,
  handler
})

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
