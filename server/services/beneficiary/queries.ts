import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import {
  AppContextPermissions,
  FamilyFilePermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getFamilyFilePermissions
} from '~/server/security'
import { isObjectEmpty } from '~/utils/isObjectEmpty'

export const include = {
  familyFile: {
    select: {
      structureId: true,
      socialSupports: {
        select: {
          subjects: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      referents: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true
        }
      }
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
      birthDate: true
    }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findWithNoDraftCondition(user, {
    where: {
      id
    },
    include
  })
}

type BeneficiaryOutput = Prisma.PromiseReturnType<typeof findOne>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const beneficiary = await findOne(ctx.user, id)
  const permissions = getFamilyFilePermissions({
    ctx,
    familyFile: beneficiary.familyFile
  })
  const appPermissions = getAppContextPermissions(ctx)
  return {
    beneficiary: filter(permissions, appPermissions, beneficiary),
    permissions
  }
}

export async function getPage(
  ctx: SecurityRuleContext,
  args: Omit<Prisma.BeneficiaryFindManyArgs, 'select' | 'include'>
) {
  const beneficiaries = await BeneficiaryRepo.findMany(ctx.user, {
    where: args.where,
    include,
    take: args.take,
    skip: args.skip,
    orderBy: args.orderBy
  })
  const appPermissions = getAppContextPermissions(ctx)
  return beneficiaries.map(beneficiary => {
    const permissions = getFamilyFilePermissions({
      ctx,
      familyFile: beneficiary.familyFile
    })
    return {
      beneficiary: filter(permissions, appPermissions, beneficiary),
      permissions
    }
  })
}

const filter = (
  permissions: FamilyFilePermissions,
  appPermissions: AppContextPermissions,
  beneficiary: BeneficiaryOutput
) => {
  const general = getGeneral(beneficiary, appPermissions)

  const { view } = permissions

  const externalOrganisations = view.externalOrganisations
    ? getExternalOrganisations(beneficiary)
    : undefined
  const health =
    appPermissions.module.health && view.health
      ? getHealth(beneficiary)
      : undefined
  const occupationIncome = view.occupationIncome
    ? getOccupationIncome(beneficiary, appPermissions)
    : undefined

  const entourages = view.relatives ? getEntourages(beneficiary) : undefined
  const taxHouseholds = view.relatives
    ? getTaxHouseholds(beneficiary)
    : undefined

  return {
    id: beneficiary.id,
    familyFileId: beneficiary.familyFile.structureId,
    fileNumber: beneficiary.fileNumber,
    status: beneficiary.status,
    draft: beneficiary.draft,
    referents: beneficiary.familyFile.referents,
    structureId: beneficiary.structureId,
    additionalInformation: beneficiary.additionalInformation,
    createdById: beneficiary.createdById,
    created: beneficiary.created,
    updated: beneficiary.updated,
    archivedById: beneficiary.archivedById,
    archived: beneficiary.archived,
    aidantConnectAuthorized: beneficiary.aidantConnectAuthorized,
    vulnerablePerson: beneficiary.vulnerablePerson,
    general,
    externalOrganisations: !isObjectEmpty(externalOrganisations)
      ? externalOrganisations
      : undefined,
    health: !isObjectEmpty(health) ? health : undefined,
    occupationIncome: !isObjectEmpty(occupationIncome)
      ? occupationIncome
      : undefined,
    taxHouseholds: !isObjectEmpty(taxHouseholds) ? taxHouseholds : undefined,
    entourages: !isObjectEmpty(entourages) ? entourages : undefined
  }
}

function getGeneral(
  beneficiary: BeneficiaryOutput,
  permissions: AppContextPermissions
) {
  const { module } = permissions
  const general = {
    title: beneficiary.title,
    usualName: beneficiary.usualName,
    birthName: beneficiary.birthName,
    firstName: beneficiary.firstName,
    birthDate: beneficiary.birthDate,
    birthPlace: beneficiary.birthPlace,
    deathDate: beneficiary.deathDate,
    gender: beneficiary.gender,
    nationality: beneficiary.nationality,
    numeroPegase: module.ministere ? beneficiary.numeroPegase : null,
    accommodationMode: beneficiary.accommodationMode,
    accommodationName: beneficiary.accommodationName,
    accommodationZone: module.ministere ? beneficiary.accommodationZone : null,
    accommodationAdditionalInformation:
      beneficiary.accommodationAdditionalInformation,
    street: beneficiary.street,
    addressComplement: beneficiary.addressComplement,
    zipcode: beneficiary.zipcode,
    city: beneficiary.city,
    region: beneficiary.region,
    department: beneficiary.department,
    noPhone: beneficiary.noPhone,
    phone1: beneficiary.phone1,
    phone2: beneficiary.phone2,
    email: beneficiary.email,
    mobility: beneficiary.mobility,
    additionalInformation: beneficiary.additionalInformation
  }

  return general
}

function getEntourages(beneficiary: BeneficiaryOutput) {
  const { relatives } = beneficiary
  return (relatives || []).filter(relative => !relative.hosted)
}

function getTaxHouseholds(beneficiary: BeneficiaryOutput) {
  const {
    relatives,
    divorceDate,
    weddingDate,
    familySituation,
    minorChildren,
    majorChildren,
    caregiver
  } = beneficiary

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)

  return {
    taxHouseholds,
    familySituation,
    divorceDate,
    weddingDate,
    minorChildren,
    majorChildren,
    caregiver
  }
}

function getHealth(beneficiary: BeneficiaryOutput) {
  return {
    gir: beneficiary.gir,
    doctor: beneficiary.doctor,
    healthAdditionalInformation: beneficiary.healthAdditionalInformation,
    socialSecurityNumber: beneficiary.socialSecurityNumber,
    insurance: beneficiary.insurance
  }
}

function getOccupationIncome(
  beneficiary: BeneficiaryOutput,
  permissions: AppContextPermissions
) {
  const { module } = permissions
  return {
    socioProfessionalCategory: beneficiary.socioProfessionalCategory,
    occupation: beneficiary.occupation,
    studyLevel: beneficiary.studyLevel,
    employer: beneficiary.employer,
    employerSiret: beneficiary.employerSiret,
    unemploymentNumber: beneficiary.unemploymentNumber,
    pensionOrganisations: beneficiary.pensionOrganisations,
    otherPensionOrganisations: beneficiary.otherPensionOrganisations,
    cafNumber: beneficiary.cafNumber,
    // bank: beneficiary.bank,
    // funeralContract: beneficiary.funeralContract,
    ministereCategorie: module.ministere
      ? beneficiary.ministereCategorie
      : null,
    ministereDepartementServiceAc: module.ministere
      ? beneficiary.ministereDepartementServiceAc
      : null,
    ministereStructure: module.ministere ? beneficiary.ministereStructure : null
  }
}

function getExternalOrganisations(beneficiary: BeneficiaryOutput) {
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
