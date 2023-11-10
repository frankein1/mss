import { Prisma, StructureType } from '@prisma/client'
import { getBeneficiaryFollowUpTypes } from './getBeneficiaryFollowUpTypes'
import { BeneficiaryRepo } from '~/server/database'
import {
  SecurityRuleGrantee,
  canViewDocument,
  getBeneficiaryEditPermissions
} from '~/server/security'

export async function getBeneficiaryDetails({
  user,
  structure,
  id
}: {
  user: SecurityRuleGrantee
  structure: { type: StructureType }
  id: string
}) {
  const beneficiary = await findBeneficiary(user, id)
  const { view } = getBeneficiaryEditPermissions({
    user,
    target: beneficiary,
    structure
  })

  const meta = getMeta(beneficiary)
  const general = getGeneral(beneficiary)

  const {
    taxHouseholds,
    entourages,
    familySituation,
    majorChildren,
    minorChildren
  } = getRelatives(beneficiary)

  const externalOrganisations = view.externalOrganisations
    ? getExternalOrganisations(beneficiary)
    : undefined
  const health = view.health ? getHealth(beneficiary) : undefined
  const occupationIncome = view.occupationIncome
    ? getOccupationIncome(beneficiary)
    : undefined

  const documents = beneficiary.documents.filter(document =>
    canViewDocument(user, beneficiary, document)
  )
  const history = getHistory(beneficiary)

  return {
    id: beneficiary.id,
    meta,
    general,
    externalOrganisations,
    health,
    occupationIncome,
    documents,
    taxHouseholds: view.relatives
      ? {
          familySituation,
          majorChildren,
          minorChildren,
          taxHouseholds
        }
      : undefined,
    entourages: view.relatives ? entourages : undefined,
    history
  }
}

type FindBeneficiaryOutput = Prisma.PromiseReturnType<typeof findBeneficiary>

async function findBeneficiary(user: SecurityRuleGrantee, id: string) {
  return await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    include: {
      referents: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true
        }
      },
      relatives: {
        select: {
          id: true,
          lastName: true,
          firstName: true,
          relationship: true,
          city: true,
          email: true,
          phone: true,
          hosted: true,
          caregiver: true,
          beneficiaryId: true,
          additionalInformation: true,
          birthDate: true,
          linkedBeneficiary: {
            select: {
              id: true,
              firstName: true,
              email: true,
              title: true,
              usualName: true,
              phone1: true,
              birthDate: true
            }
          }
        }
      },
      documents: true,
      followups: {
        include: {
          types: true
        }
      },
      helpRequests: {
        include: {
          type: true
        }
      }
    }
  })
}

function getMeta(beneficiary: FindBeneficiaryOutput) {
  return {
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

function getHistory(beneficiary: FindBeneficiaryOutput) {
  return {
    historyTotal:
      beneficiary.helpRequests.length + beneficiary.followups.length,
    types: getBeneficiaryFollowUpTypes({
      followups: beneficiary.followups,
      helpRequests: beneficiary.helpRequests
    })
  }
}

function getGeneral(beneficiary: FindBeneficiaryOutput) {
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
    mobility: beneficiary.mobility,
    additionalInformation: beneficiary.additionalInformation
  }
}

function getRelatives(beneficiary: FindBeneficiaryOutput) {
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

function getHealth(beneficiary: FindBeneficiaryOutput) {
  return {
    gir: beneficiary.gir,
    doctor: beneficiary.doctor,
    healthAdditionalInformation: beneficiary.healthAdditionalInformation,
    socialSecurityNumber: beneficiary.socialSecurityNumber,
    insurance: beneficiary.insurance
  }
}

function getOccupationIncome(beneficiary: FindBeneficiaryOutput) {
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

function getExternalOrganisations(beneficiary: FindBeneficiaryOutput) {
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
