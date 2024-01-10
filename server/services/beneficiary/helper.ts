import { Prisma } from '@prisma/client'
import {
  SaveDraftInput,
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryTaxHouseholdInput,
  SaveBeneficiaryEntourageInput,
  SaveBeneficiaryHealthInput,
  SaveBeneficiaryOccupationInput,
  SaveBeneficiaryExternalOrganisationsInput,
  BeneficiaryFilterInput
} from '~/server/schema'
import { getBeneficiaryPermissions } from '~/server/security'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { BeneficiaryDraft } from '~/types/beneficiary'
import { prepareDateFields } from '~/utils/prisma'
import { SecurityRuleContext } from '~/server/security/rules/types'

export function prepareDataFromDraft(
  ctx: SecurityRuleContext,
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const { user } = ctx
  const {
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  } = getDataFromSources(input, beneficiaryDraft)

  if (!general) {
    throw new Error(
      'Beneficiary should at least have general information defined.'
    )
  }

  const fileNumber = generateFileNumber()

  let data = {
    structureId: user.structureId,
    fileNumber,
    ...prepareDateFields(general, ['birthDate', 'deathDate']),
    phone1: general.noPhone ? null : general.phone1,
    phone2: general.noPhone ? null : general.phone2,
    referents: {
      connect: general.referents.map(referent => ({ id: referent }))
    },
    createdById: user.id
  } as Prisma.BeneficiaryUncheckedCreateInput

  const permissions = getBeneficiaryPermissions({ ctx })

  if ((taxHousehold || entourage) && permissions.edit.relatives) {
    if (taxHousehold) {
      const { taxHouseholds: _, ...taxHouseholdDatas } = taxHousehold

      data = {
        ...data,
        ...taxHouseholdDatas
      }
    }

    const taxHouseholds =
      taxHousehold?.taxHouseholds?.map(({ linkedBeneficiary, ...e }) => {
        return {
          ...prepareDateFields(e, ['birthDate']),
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null
        }
      }) || []
    const entourages =
      entourage?.entourages?.map(e => ({ ...e, hosted: false })) || []
    const newRelatives = [...taxHouseholds, ...entourages]

    data = {
      ...data,
      relatives: {
        createMany: {
          data: newRelatives
        }
      }
    }
  }

  if (health && permissions.edit.health) {
    data = { ...data, ...health }
  }

  if (permissions.edit.occupationIncome) {
    data = { ...data, ...occupation }
  }

  if (permissions.edit.externalOrganisations) {
    data = { ...data, ...externalOrganisations }
  }

  return data
}

function getDataFromSources(
  input: SaveDraftInput,
  beneficiaryDraft: BeneficiaryDraft
) {
  const general = (input.general || beneficiaryDraft.content?.general) as
    | SaveBeneficiaryGeneralInformationInput
    | undefined
  const taxHousehold = (input.taxHousehold ||
    beneficiaryDraft.content?.taxHousehold) as
    | SaveBeneficiaryTaxHouseholdInput
    | undefined
  const entourage = (input.entourage || beneficiaryDraft.content?.entourage) as
    | SaveBeneficiaryEntourageInput
    | undefined
  const health = (input.health || beneficiaryDraft.content?.health) as
    | SaveBeneficiaryHealthInput
    | undefined
  const occupation = (input.occupation ||
    beneficiaryDraft.content?.occupation) as
    | SaveBeneficiaryOccupationInput
    | undefined
  const externalOrganisations = (input.externalOrganisations ||
    beneficiaryDraft.content?.externalOrganisations) as
    | SaveBeneficiaryExternalOrganisationsInput
    | undefined

  return {
    general,
    taxHousehold,
    entourage,
    health,
    occupation,
    externalOrganisations
  }
}

export function prepareBeneficiarySearchConditions(query: string) {
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['firstName', 'birthName', 'usualName', 'fileNumber'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: {
        contains: token,
        mode: 'insensitive'
      }
    }))
  }))

  return { AND: searchConditions }
}

export function prepareBeneficiaryFilters(filters: BeneficiaryFilterInput) {
  const formattedFilters: Prisma.BeneficiaryWhereInput = {}
  formattedFilters.socialSupports = {}

  if (filters.search) {
    const searchConditions = prepareBeneficiarySearchConditions(filters.search)
    formattedFilters.AND = searchConditions.AND
  }

  if (filters.followupTypes) {
    const typesListFilter: Prisma.FollowupTypeWhereInput = {
      id: { in: filters.followupTypes }
    }

    formattedFilters.socialSupports = {
      some: { types: { some: typesListFilter } }
    }
  }

  if (filters.referents) {
    formattedFilters.referents = { some: { id: { in: filters.referents } } }
  }

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.ageGroup) {
    const dateRange = ageGroupToDateRange(filters.ageGroup)
    formattedFilters.birthDate = {
      gte: dateRange.lower?.toDate(),
      lte: dateRange.upper?.toDate()
    }
  }

  return formattedFilters
}
