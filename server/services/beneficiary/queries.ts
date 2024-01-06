import { Prisma } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import {
  BeneficiaryPermissions,
  SecurityRuleContext,
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'

export const include = {
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
  followupTypes: {
    select: {
      typeId: true,
      name: true
    }
  },
  _count: {
    select: { helpRequests: true, followups: true }
  }
}

function findOne(user: SecurityRuleGrantee, id: string) {
  return BeneficiaryRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    include
  })
}

type BeneficiaryOutput = Prisma.PromiseReturnType<typeof findOne>

export async function getOne(ctx: SecurityRuleContext, id: string) {
  const beneficiary = await findOne(ctx.user, id)
  const permissions = getBeneficiaryPermissions({
    ctx,
    beneficiary
  })
  return {
    beneficiary: filter(permissions, beneficiary),
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
  return beneficiaries.map(beneficiary => {
    const permissions = getBeneficiaryPermissions({
      ctx,
      beneficiary
    })
    return {
      beneficiary: filter(permissions, beneficiary),
      permissions
    }
  })
}

const filter = (
  permissions: BeneficiaryPermissions,
  beneficiary: BeneficiaryOutput
) => {
  const general = getGeneral(beneficiary, permissions)

  const { view } = permissions

  const externalOrganisations = view.externalOrganisations
    ? getExternalOrganisations(beneficiary)
    : undefined
  const health = view.health ? getHealth(beneficiary, permissions) : undefined
  const occupationIncome = view.occupationIncome
    ? getOccupationIncome(beneficiary, permissions)
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
    referents: beneficiary.referents,
    structureId: beneficiary.structureId,
    additionalInformation: beneficiary.additionalInformation,
    createdById: beneficiary.createdById,
    created: beneficiary.created,
    updated: beneficiary.updated,
    archivedById: beneficiary.archivedById,
    archived: beneficiary.archived,
    aidantConnectAuthorized: beneficiary.aidantConnectAuthorized,
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
    historyTotal:
      beneficiary._count.followups + beneficiary._count.helpRequests,
    types: beneficiary.followupTypes.map(ft => ({
      id: ft.typeId,
      name: ft.name
    }))
  }
}

function getGeneral(
  beneficiary: BeneficiaryOutput,
  permissions: BeneficiaryPermissions
) {
  const { get } = permissions
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
    numeroPegase: get.numeroPegase ? beneficiary.numeroPegase : null,
    accommodationMode: beneficiary.accommodationMode,
    accommodationName: beneficiary.accommodationName,
    accommodationZone: get.accommodationZone
      ? beneficiary.accommodationZone
      : null,
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

function getHealth(
  beneficiary: BeneficiaryOutput,
  permissions: BeneficiaryPermissions
) {
  const { get } = permissions
  return {
    gir: beneficiary.gir,
    doctor: beneficiary.doctor,
    healthAdditionalInformation: beneficiary.healthAdditionalInformation,
    socialSecurityNumber: get.nir ? beneficiary.socialSecurityNumber : null,
    insurance: beneficiary.insurance
  }
}

function getOccupationIncome(
  beneficiary: BeneficiaryOutput,
  permissions: BeneficiaryPermissions
) {
  const { get } = permissions
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
    otherMembersMainIncomeSource: beneficiary.otherMembersMainIncomeSource,
    otherMembersMainIncomeAmount: beneficiary.otherMembersMainIncomeAmount,
    unemploymentNumber: beneficiary.unemploymentNumber,
    pensionOrganisations: beneficiary.pensionOrganisations,
    otherPensionOrganisations: beneficiary.otherPensionOrganisations,
    cafNumber: beneficiary.cafNumber,
    bank: beneficiary.bank,
    funeralContract: beneficiary.funeralContract,
    ministereCategorie: get.ministereCategorie
      ? beneficiary.ministereCategorie
      : null,
    ministereDepartementServiceAc: get.ministereDepartementServiceAc
      ? beneficiary.ministereDepartementServiceAc
      : null,
    ministereStructure: get.ministereStructure
      ? beneficiary.ministereStructure
      : null
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
