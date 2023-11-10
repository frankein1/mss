import { inferAsyncReturnType } from '@trpc/server'
import { getBeneficiaryRelativeDisplayName } from './getBeneficiaryRelativeDisplayName'
import { getBeneficiaryAccessibleData } from './getBeneficiaryAccessibleData'
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
import { familySituationLabels } from '~/client/options/familySituation'
import {
  ministereCategorieLabels,
  ministereDepartmentServiceAcLabels,
  ministereStructureLabels
} from '~/client/options/ministry'
import { Nationalities } from '~/client/options/nationality'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import { readableFileNumber } from '~/utils/readableFileNumber'
import { formatUserDisplayName } from '~/utils/user'
import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'

function getRelativeExportData(
  relative: BeneficiaryRelativeWithLinkedBeneficiary
) {
  const displayName = getBeneficiaryRelativeDisplayName(relative)
  if (relative.relationship) {
    return `${displayName} (${
      relativeRelationshipLabels[relative.relationship]
    })`
  }
  return displayName
}

export function getBeneficiaryExportData(
  beneficiary: inferAsyncReturnType<typeof getBeneficiaryAccessibleData>
) {
  return {
    referents: beneficiary.beneficiary.referents
      .map(referent => formatUserDisplayName(referent))
      .join(', '),
    aidantConnectAuthorized: getBooleanOrEmpty(
      beneficiary.beneficiary.aidantConnectAuthorized
    ),
    fileNumber: readableFileNumber(beneficiary.beneficiary.id),
    status: beneficiaryStatusLabels[beneficiary.beneficiary.status],
    usualName: beneficiary.beneficiary.usualName || '',
    birthName: beneficiary.beneficiary.birthName || '',
    firstName: beneficiary.beneficiary.firstName || '',
    birthDate: formatDate(beneficiary.beneficiary.birthDate, 'DD-MM-YYYY'),
    deathDate: formatDate(beneficiary.beneficiary.deathDate, 'DD-MM-YYYY'),
    gender: beneficiary.beneficiary.gender
      ? beneficiaryGenderLabels[beneficiary.beneficiary.gender]
      : '',
    nationality: beneficiary.beneficiary.nationality
      ? Nationalities[beneficiary.beneficiary.nationality]
      : '',
    accommodationMode: beneficiary.beneficiary.accommodationMode
      ? beneficiaryAccommodationModeLabels[
          beneficiary.beneficiary.accommodationMode
        ]
      : '',
    accommodationName: beneficiary.beneficiary.accommodationName || '',
    accommodationAdditionalInformation:
      beneficiary.beneficiary.accommodationAdditionalInformation || '',
    street: beneficiary.beneficiary.street || '',
    addressComplement: beneficiary.beneficiary.addressComplement || '',
    zipcode: beneficiary.beneficiary.zipcode || '',
    city: beneficiary.beneficiary.city || '',
    region: beneficiary.beneficiary.region || '',
    phone1: beneficiary.beneficiary.phone1 || '',
    phone2: beneficiary.beneficiary.phone2 || '',
    email: beneficiary.beneficiary.email || '',
    familySituation: beneficiary.beneficiary.familySituation
      ? familySituationLabels[beneficiary.beneficiary.familySituation]
      : '',
    caregiver: getBooleanOrEmpty(beneficiary.beneficiary.caregiver),
    minorChildren: beneficiary.beneficiary.minorChildren?.toString() || '',
    majorChildren: beneficiary.beneficiary.majorChildren?.toString() || '',
    mobility: beneficiary.beneficiary.mobility
      ? beneficiaryMobilityLabels[beneficiary.beneficiary.mobility]
      : '',
    ministereCategorie: beneficiary.beneficiary.ministereCategorie
      ? ministereCategorieLabels[beneficiary.beneficiary.ministereCategorie]
      : '',
    ministereDepartementServiceAc: beneficiary.beneficiary
      .ministereDepartementServiceAc
      ? ministereDepartmentServiceAcLabels[
          beneficiary.beneficiary.ministereDepartementServiceAc
        ]
      : '',
    ministereStructure: beneficiary.beneficiary.ministereStructure
      ? ministereStructureLabels[beneficiary.beneficiary.ministereStructure]
      : '',
    socioProfessionalCategory: beneficiary.beneficiary.socioProfessionalCategory
      ? beneficiarySocioProfessionalCategoryLabels[
          beneficiary.beneficiary.socioProfessionalCategory
        ]
      : '',
    occupation: beneficiary.beneficiary.occupation || '',
    employer: beneficiary.beneficiary.employer || '',
    employerSiret: beneficiary.beneficiary.employerSiret || '',
    mainIncomeSource: beneficiary.beneficiary.mainIncomeSource
      ? beneficiary.beneficiary.mainIncomeSource
          .map(incomeSource => incomeSourceLabels[incomeSource])
          .join(', ')
      : '',
    mainIncomeAmount:
      beneficiary.beneficiary.mainIncomeAmount?.toString() || '',
    partnerMainIncomeSource: beneficiary.beneficiary.partnerMainIncomeSource
      ? beneficiary.beneficiary.partnerMainIncomeSource
          .map(incomeSource => incomeSourceLabels[incomeSource])
          .join(', ')
      : '',
    partnerMainIncomeAmount:
      beneficiary.beneficiary.partnerMainIncomeAmount?.toString() || '',
    majorChildrenMainIncomeSource: beneficiary.beneficiary
      .majorChildrenMainIncomeSource
      ? beneficiary.beneficiary.majorChildrenMainIncomeSource
          .map(incomeSource => incomeSourceLabels[incomeSource])
          .join(', ')
      : '',
    majorChildrenMainIncomeAmount:
      beneficiary.beneficiary.majorChildrenMainIncomeAmount?.toString() || '',
    unemploymentNumber: beneficiary.beneficiary.unemploymentNumber || '',
    pensionOrganisations: beneficiary.beneficiary.pensionOrganisations
      ? beneficiary.beneficiary.pensionOrganisations
          .map(
            pensionOrganisation =>
              pensionOrganisationLabels[pensionOrganisation]
          )
          .join(', ')
      : '',
    otherPensionOrganisations:
      beneficiary.beneficiary.otherPensionOrganisations || '',
    cafNumber: beneficiary.beneficiary.cafNumber || '',
    bank: beneficiary.beneficiary.bank || '',
    funeralContract: beneficiary.beneficiary.funeralContract || '',
    additionalInformation: beneficiary.beneficiary.additionalInformation || '',
    numeroPegase: beneficiary.beneficiary.numeroPegase || '',
    accommodationZone: beneficiary.beneficiary.accommodationZone
      ? beneficiaryAccommodationZoneLabels[
          beneficiary.beneficiary.accommodationZone
        ]
      : '',
    updated: formatDate(beneficiary.beneficiary.updated, 'DD-MM-YYYY HH:mm'),
    entourages:
      beneficiary.entourages?.map(getRelativeExportData).join(', ') || '',
    taxHouseholds:
      beneficiary.taxHouseholds?.map(getRelativeExportData).join(', ') || '',
    documents: beneficiary.beneficiary.documents
      .map(document => document.name)
      .join(', '),
    historyTotal: beneficiary.beneficiary.historyTotal.toString(),
    types: beneficiary.beneficiary.types.map(({ name }) => name).join(', ')
  }
}
