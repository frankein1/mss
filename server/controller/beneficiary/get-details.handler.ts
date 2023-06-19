import type { User } from '@prisma/client'
import { getBeneficiaryReferentsAndRelatives } from '~/server/query/beneficiaires'
import { AppContext, forbiddenError } from '~/server/trpc'
import {
  canViewBeneficiary,
  canViewBeneficiaryRelatives,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome,
  canViewBeneficiaryExternalOrganisations
} from '~/server/security/rules'
import type { BeneficiaryWithReferentsAndRelatives } from '~/types/beneficiary'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const beneficiary = await getBeneficiaryReferentsAndRelatives({
    id: input.id,
    structureId: user.structureId
  })

  if (!canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }
  const beneficiaryAccessibleData = getBeneficiaryAccessibleData(
    user,
    beneficiary
  )

  return beneficiaryAccessibleData
}

function getBeneficiaryAccessibleData(
  user: User,
  beneficiary: BeneficiaryWithReferentsAndRelatives
) {
  const meta = getBeneficiaryMeta(beneficiary)
  const generalInformation = getBeneficiaryGeneralInformation(user, beneficiary)
  const {
    taxHouseholds,
    entourages,
    familySituation,
    majorChildren,
    minorChildren
  } = getBeneficiaryRelatives(user, beneficiary)
  const health = getBeneficiaryHealth(user, beneficiary)
  const occupationIncome = getBeneficiaryOccupationIncome(user, beneficiary)
  const externalOrganisations = getBeneficiaryExternalOrganisations(
    user,
    beneficiary
  )

  return {
    beneficiary: {
      ...meta,
      ...generalInformation,
      ...health,
      ...occupationIncome,
      ...externalOrganisations,
      familySituation,
      majorChildren,
      minorChildren
    },
    taxHouseholds,
    entourages
  }
}

function getBeneficiaryMeta(beneficiary: BeneficiaryWithReferentsAndRelatives) {
  return {
    id: beneficiary.id,
    fileNumber: beneficiary.fileNumber,
    status: beneficiary.status,
    referents: beneficiary.referents,
    structureId: beneficiary.structureId,
    additionalInformation: beneficiary.additionalInformation,
    createdById: beneficiary.createdById,
    created: beneficiary.created,
    updated: beneficiary.updated,
    archivedById: beneficiary.archivedById,
    archived: beneficiary.archived,
    aidantConnectAuthorized: beneficiary.aidantConnectAuthorized
  }
}

function getBeneficiaryGeneralInformation(
  user: User,
  beneficiary: BeneficiaryWithReferentsAndRelatives
) {
  return {
    title: beneficiary.title,
    usualName: beneficiary.usualName,
    birthName: beneficiary.birthName,
    firstName: beneficiary.firstName,
    birthDate: beneficiary.birthDate,
    birthPlace: beneficiary.birthPlace,
    deathDate: beneficiary.deathDate,
    gender: beneficiary.gender,
    nationality: beneficiary.nationality,
    numeroPegase: beneficiary.numeroPegase,
    accommodationMode: beneficiary.accommodationMode,
    accommodationName: beneficiary.accommodationName,
    accommodationZone: beneficiary.accommodationZone,
    accommodationAdditionalInformation:
      beneficiary.accommodationAdditionalInformation,
    street: beneficiary.street,
    streetNumber: beneficiary.streetNumber,
    addressComplement: beneficiary.addressComplement,
    zipcode: beneficiary.zipcode,
    city: beneficiary.city,
    region: beneficiary.region,
    noPhone: beneficiary.noPhone,
    phone1: beneficiary.phone1,
    phone2: beneficiary.phone2,
    email: beneficiary.email,
    caregiver: beneficiary.caregiver,
    mobility: beneficiary.mobility
  }
}

function getBeneficiaryRelatives(
  user: User,
  beneficiary: BeneficiaryWithReferentsAndRelatives
) {
  if (!canViewBeneficiaryRelatives(user, beneficiary)) {
    return {}
  }

  const { relatives, familySituation, minorChildren, majorChildren } =
    beneficiary

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)
  const entourages = (relatives || []).filter(relative => !relative.hosted)

  return {
    taxHouseholds,
    entourages,
    familySituation,
    minorChildren,
    majorChildren
  }
}

function getBeneficiaryHealth(
  user: User,
  beneficiary: BeneficiaryWithReferentsAndRelatives
) {
  if (!canViewBeneficiaryHealthInfo(user, beneficiary)) {
    return {}
  }
  return {
    gir: beneficiary.gir,
    doctor: beneficiary.doctor,
    healthAdditionalInformation: beneficiary.healthAdditionalInformation,
    socialSecurityNumber: beneficiary.socialSecurityNumber,
    insurance: beneficiary.insurance
  }
}

function getBeneficiaryOccupationIncome(
  user: User,
  beneficiary: BeneficiaryWithReferentsAndRelatives
) {
  if (!canViewBeneficiaryOccupationIncome(user, beneficiary)) {
    return {}
  }
  return {
    socioProfessionalCategory: beneficiary.socioProfessionalCategory,
    occupation: beneficiary.occupation,
    employer: beneficiary.employer,
    employerSiret: beneficiary.employerSiret,
    mainIncomeSource: beneficiary.mainIncomeSource,
    mainIncomeAmount: beneficiary.mainIncomeAmount,
    partnerMainIncomeSource: beneficiary.partnerMainIncomeSource,
    partnerMainIncomeAmount: beneficiary.partnerMainIncomeAmount,
    majorChildrenMainIncomeSource: beneficiary.majorChildrenMainIncomeSource,
    majorChildrenMainIncomeAmount: beneficiary.majorChildrenMainIncomeAmount,
    unemploymentNumber: beneficiary.unemploymentNumber,
    pensionOrganisations: beneficiary.pensionOrganisations,
    otherPensionOrganisations: beneficiary.otherPensionOrganisations,
    cafNumber: beneficiary.cafNumber,
    bank: beneficiary.bank,
    funeralContract: beneficiary.funeralContract,
    ministereCategorie: beneficiary.ministereCategorie,
    ministereDepartementServiceAc: beneficiary.ministereDepartementServiceAc,
    ministereStructure: beneficiary.ministereStructure
  }
}

function getBeneficiaryExternalOrganisations(
  user: User,
  beneficiary: BeneficiaryWithReferentsAndRelatives
) {
  if (!canViewBeneficiaryExternalOrganisations(user, beneficiary)) {
    return {}
  }
  return {
    protectionMeasure: beneficiary.protectionMeasure,
    representative: beneficiary.representative,
    prescribingStructure: beneficiary.prescribingStructure,
    orientationType: beneficiary.orientationType,
    orientationStructure: beneficiary.orientationStructure,
    serviceProviders: beneficiary.serviceProviders,
    involvedPartners: beneficiary.involvedPartners,
    additionalInformation: beneficiary.additionalInformation
  }
}
