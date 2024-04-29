import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import {
  AppContextPermissions,
  BeneficiaryPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getAppContextPermissions,
  getBeneficiaryPermissions
} from '~/server/security'
import { isObjectEmpty } from '~/utils/isObjectEmpty'

export const include = {
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
  },
  _count: {
    select: { socialSupports: true }
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
type SocialSupportSubjects =
  BeneficiaryOutput['socialSupports'][0]['subjects'][0]

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const beneficiary = await findOne(ctx.user, id)
  const permissions = getBeneficiaryPermissions({
    ctx,
    beneficiary
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
    const permissions = getBeneficiaryPermissions({
      ctx,
      beneficiary
    })
    return {
      beneficiary: filter(permissions, appPermissions, beneficiary),
      permissions
    }
  })
}

const filter = (
  permissions: BeneficiaryPermissions,
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

  const history = getHistory(beneficiary)

  return {
    id: beneficiary.id,
    fileNumber: beneficiary.fileNumber,
    status: beneficiary.status,
    draft: beneficiary.draft,
    referents: beneficiary.referents,
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
    entourages: !isObjectEmpty(entourages) ? entourages : undefined,
    history
  }
}

function getHistory(beneficiary: BeneficiaryOutput) {
  return {
    historyTotal: beneficiary._count.socialSupports,
    subjects: getUniqueSubjects(beneficiary)
  }
}

function getUniqueSubjects(beneficiary: BeneficiaryOutput) {
  return beneficiary.socialSupports.reduce((subjects, ss) => {
    if (!ss.subjects.length) {
      return subjects
    }

    const notCollectedSubjects: SocialSupportSubjects[] = []

    ss.subjects.forEach(subject => {
      const isNotInSubjects = subjects.every(t => t.id !== subject.id)
      const isNotInNotCollectedSubjects = notCollectedSubjects.every(
        t => t.id !== subject.id
      )

      if (isNotInSubjects && isNotInNotCollectedSubjects) {
        notCollectedSubjects.push(subject)
      }
    })

    return [...subjects, ...notCollectedSubjects]
  }, [] as SocialSupportSubjects[])
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
    familySituation,
    minorChildren,
    majorChildren,
    caregiver
  } = beneficiary

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)

  return {
    taxHouseholds,
    familySituation,
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
