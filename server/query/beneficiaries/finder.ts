import { Prisma, StructureType } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import {
  BeneficiaryPermissions,
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'

const columnsSelection = {
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
  incomes: {
    select: {
      id: true,
      hostedRelative: true,
      incomeSource: true,
      incomeAmount: true
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

const isEmpty = (object: any) => {
  if (!object) {
    return object
  }
  return Object.values(object).every(
    x => x === null || x === '' || (Array.isArray(x) && x.length === 0)
  )
}

type FindOutput = Prisma.PromiseReturnType<typeof find>

async function find(user: SecurityRuleGrantee, id: string) {
  return await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: {
      id
    },
    include: columnsSelection
  })
}

const filter = ({
  user,
  structure,
  beneficiary
}: {
  user: SecurityRuleGrantee
  structure: { type: StructureType }
  beneficiary: FindOutput
}) => {
  const permissions = getBeneficiaryPermissions({
    user,
    target: beneficiary,
    structure
  })

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
    externalOrganisations: !isEmpty(externalOrganisations)
      ? externalOrganisations
      : undefined,
    health: !isEmpty(health) ? health : undefined,
    occupationIncome: !isEmpty(occupationIncome) ? occupationIncome : undefined,
    taxHouseholds: !isEmpty(taxHouseholds) ? taxHouseholds : undefined,
    entourages: !isEmpty(entourages) ? entourages : undefined,
    history
  }
}

export async function findBeneficiaries({
  user,
  structure,
  where,
  orderBy
}: {
  user: SecurityRuleGrantee
  structure: { type: StructureType }
  where: Prisma.BeneficiaryWhereInput
  orderBy:
    | Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput
    | Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput[]
}) {
  const beneficiaries =
    (await BeneficiaryRepo.findMany(user, {
      include: columnsSelection,
      where,
      orderBy
    })) || []

  return beneficiaries.map(beneficiary =>
    filter({ user, beneficiary, structure })
  )
}

export async function findBeneficiary({
  user,
  structure,
  id
}: {
  user: SecurityRuleGrantee
  structure: { type: StructureType }
  id: string
}) {
  const beneficiary = await find(user, id)
  return filter({ user, beneficiary, structure })
}

function getHistory(beneficiary: FindOutput) {
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
  beneficiary: FindOutput,
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
    noPhone: beneficiary.noPhone,
    phone1: beneficiary.phone1,
    phone2: beneficiary.phone2,
    email: beneficiary.email,
    mobility: beneficiary.mobility,
    additionalInformation: beneficiary.additionalInformation
  }

  return general
}

function getEntourages(beneficiary: FindOutput) {
  const { relatives } = beneficiary
  return (relatives || []).filter(relative => !relative.hosted)
}

function getTaxHouseholds(beneficiary: FindOutput) {
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
  beneficiary: FindOutput,
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
  beneficiary: FindOutput,
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
    incomes: beneficiary.incomes,
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

function getExternalOrganisations(beneficiary: FindOutput) {
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
