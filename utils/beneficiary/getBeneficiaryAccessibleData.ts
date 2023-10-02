import { ProtectedAppContextUser, ProtectedAppContext } from '~/server/trpc'
import {
  canListBeneficiaryRelatives,
  canViewBeneficiaryHealthInfo,
  canViewBeneficiaryOccupationIncome,
  canViewBeneficiaryExternalOrganisations,
  canViewBeneficiaryNir,
  canViewDocument
} from '~/server/security/rules'
import type { BeneficiaryWithRelations } from '~/types/beneficiary'
import { getBeneficiaryFollowUpTypes } from '~/utils/beneficiary'

function getBeneficiaryMeta(
  user: ProtectedAppContextUser,
  beneficiary: BeneficiaryWithRelations
) {
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
    aidantConnectAuthorized: beneficiary.aidantConnectAuthorized,
    documents: beneficiary.documents.filter(document =>
      canViewDocument(user, beneficiary, document)
    )
  }
}

function getBeneficiaryHistory(
  user: ProtectedAppContextUser,
  beneficiary: BeneficiaryWithRelations
) {
  return {
    historyTotal:
      beneficiary.helpRequests.length + beneficiary.followups.length,
    types: getBeneficiaryFollowUpTypes({
      followups: beneficiary.followups,
      helpRequests: beneficiary.helpRequests
    })
  }
}

function getBeneficiaryGeneralInformation(
  beneficiary: BeneficiaryWithRelations
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
  user: ProtectedAppContextUser,
  beneficiary: BeneficiaryWithRelations
) {
  if (!canListBeneficiaryRelatives(user, beneficiary)) {
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
  { user, structure }: ProtectedAppContext,
  beneficiary: BeneficiaryWithRelations
) {
  if (!canViewBeneficiaryHealthInfo(user, beneficiary)) {
    return {}
  }

  return {
    gir: beneficiary.gir,
    doctor: beneficiary.doctor,
    healthAdditionalInformation: beneficiary.healthAdditionalInformation,
    socialSecurityNumber: canViewBeneficiaryNir(structure.type)
      ? beneficiary.socialSecurityNumber
      : undefined,
    insurance: beneficiary.insurance
  }
}

function getBeneficiaryOccupationIncome(
  user: ProtectedAppContextUser,
  beneficiary: BeneficiaryWithRelations
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
  user: ProtectedAppContextUser,
  beneficiary: BeneficiaryWithRelations
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

export function getBeneficiaryAccessibleData(
  ctx: ProtectedAppContext,
  beneficiary: BeneficiaryWithRelations
) {
  const meta = getBeneficiaryMeta(ctx.user, beneficiary)
  const generalInformation = getBeneficiaryGeneralInformation(beneficiary)
  const {
    taxHouseholds,
    entourages,
    familySituation,
    majorChildren,
    minorChildren
  } = getBeneficiaryRelatives(ctx.user, beneficiary)
  const health = getBeneficiaryHealth(ctx, beneficiary)
  const occupationIncome = getBeneficiaryOccupationIncome(ctx.user, beneficiary)
  const externalOrganisations = getBeneficiaryExternalOrganisations(
    ctx.user,
    beneficiary
  )
  const history = getBeneficiaryHistory(ctx.user, beneficiary)

  return {
    beneficiary: {
      ...meta,
      ...generalInformation,
      ...health,
      ...occupationIncome,
      ...externalOrganisations,
      ...history,
      familySituation,
      majorChildren,
      minorChildren
    },
    taxHouseholds,
    entourages
  }
}
