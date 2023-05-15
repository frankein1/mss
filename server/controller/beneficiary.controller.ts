import { TRPCError } from '@trpc/server'
import { AppContext, forbiddenError, invalidError } from '../trpc'
import {
  canEditBeneficiaryExternalOrganisations,
  canEditBeneficiaryGeneralInformation,
  canEditBeneficiaryHealthInfo,
  canEditBeneficiaryOccupationIncome,
  canListBeneficiaries,
  canUpdateBeneficiaryReferents,
  canUpdateBeneficiaryRelatives
} from '../query/security/rules'
import {
  SearchBeneficiaryInput,
  UpdateBeneficiaryInput,
  BeneficiaryCreationInput,
  GetBeneficiariesInput
} from '../schema/beneficiary.schema'
import { createBeneficiary } from '~/server/query/beneficiaires/createBeneficiary'
import { prismaClient } from '~/server/prisma'
import { Prisma } from '~/server/prisma/prismaClient'
import { BeneficiaryFilterInput } from '~/server/schema'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'

export const getBeneficiaryDetailsHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: AppContext
}) => {
  const beneficiary = await findWithReferentsAndRelatives({
    id: input.id,
    structureId: user.structureId
  })
  const { relatives, ...beneficiaryData } = beneficiary

  const taxHouseholds = (relatives || []).filter(relative => relative.hosted)
  const entourages = (relatives || []).filter(relative => !relative.hosted)

  return { beneficiary: beneficiaryData, taxHouseholds, entourages }
}

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: BeneficiaryCreationInput
  ctx: AppContext
}) => {
  const beneficiary = await createBeneficiary(input, user)

  return beneficiary
}

const tokenToSearchCondition = (token: string) => ({
  contains: token,
  mode: 'insensitive'
})

export const searchBeneficiaryHandler = async ({
  input: { query },
  ctx: { user }
}: {
  input: SearchBeneficiaryInput
  ctx: AppContext
}) => {
  const { structureId } = user

  if (!canListBeneficiaries(user, { structureId })) {
    throw forbiddenError()
  }
  // TODO unit test
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['firstName', 'birthName', 'usualName', 'fileNumber'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: tokenToSearchCondition(token)
    }))
  }))

  const conditions = {
    archived: null,
    AND: searchConditions
  }

  const where = structureId
    ? {
        ...conditions,
        structureId
      }
    : conditions

  // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
  // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
  const beneficiaries = await prismaClient.beneficiary.findMany({
    where,
    orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
    select: {
      id: true,
      usualName: true,
      firstName: true,
      birthName: true,
      fileNumber: true,
      birthDate: true
    }
  })

  return beneficiaries
}

export const updateBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryInput
  ctx: AppContext
}) => {
  const { referents: previousReferents, relatives: oldRelatives } =
    await findWithReferentsAndRelatives({
      id: input.id,
      structureId: user.structureId
    })

  const previousIds = previousReferents.map(({ id }) => id)

  const {
    id,
    structureId,
    referents: updateIds,
    aidantConnectAuthorized,
    general,
    health,
    external,
    occupation,
    taxHousehold,
    entourage
  } = input

  let data = {}

  if (
    canUpdateBeneficiaryReferents(user, {
      structureId,
      referents: previousReferents
    })
  ) {
    const newIds =
      updateIds.filter(updateId => !previousIds.includes(updateId)) || []
    const trashIds = previousIds.filter(id => !updateIds.includes(id)) || []

    const createIds = newIds.map(id => ({
      id
    }))
    const deleteIds = trashIds.map(id => ({
      id
    }))

    data = {
      ...data,
      referents: {
        connect: createIds,
        disconnect: deleteIds
      }
    }
  }
  if (canEditBeneficiaryGeneralInformation(user, input)) {
    data = { ...data, ...general, aidantConnectAuthorized }
  }
  if (canEditBeneficiaryHealthInfo(user, input)) {
    data = { ...data, ...health }
  }

  if (canEditBeneficiaryExternalOrganisations(user, input)) {
    data = { ...data, ...external }
  }
  if (canEditBeneficiaryOccupationIncome(user, input)) {
    data = { ...data, ...occupation }
  }
  if (canUpdateBeneficiaryRelatives(user, input)) {
    const { taxHouseholds: _, ...taxHouseholdDatas } = taxHousehold
    data = { ...data, ...taxHouseholdDatas }
  }

  if (canUpdateBeneficiaryRelatives(user, input)) {
    const { entourages: newEntourages } = entourage
    const previousEntourages = oldRelatives.filter(r => !r.hosted)

    const createEntourages =
      newEntourages.filter(
        ({ id }) => !previousEntourages.map(({ id }) => id).includes(id)
      ) || []
    const trashEntourages =
      previousEntourages.filter(
        ({ id }) => !newEntourages.map(({ id }) => id).includes(id)
      ) || []
    const updateEntourages =
      newEntourages.filter(({ id }) =>
        previousEntourages.map(({ id }) => id).includes(id)
      ) || []

    data = {
      ...data,
      relatives: {
        create: createEntourages,
        delete: trashEntourages.map(({ id }) => ({ id })),
        update: updateEntourages.map(({ id, ...data }) => ({
          where: { id },
          data
        }))
      }
    }
  }

  const beneficiary = await prismaClient.beneficiary.update({
    where: { id },
    data
  })
  return beneficiary
}

async function findWithReferentsAndRelatives({
  structureId,
  id
}: {
  structureId: string | null
  id: string
}) {
  const conditions = {
    id
  }

  const where = structureId
    ? {
        ...conditions,
        structureId
      }
    : conditions

  const beneficiary = await prismaClient.beneficiary.findFirst({
    where,
    include: {
      referents: true,
      relatives: {
        include: {
          beneficiary: true
        }
      }
    }
  })
  if (!beneficiary) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No beneficiary found with conditions ${JSON.stringify(where)}`
    })
  }
  return beneficiary
}

function prepareBeneficiaryFilters(filters: BeneficiaryFilterInput) {
  const followupsFilters: { [k: string]: {} } = {}
  const helpRequestsFilters: { [k: string]: {} } = {}

  if (filters.followupTypes) {
    const typesListFilter = {
      id: { in: filters.followupTypes }
    }
    followupsFilters.types = { some: typesListFilter }
    helpRequestsFilters.type = typesListFilter
  }

  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.followupTypes) {
    formattedFilters.OR = [
      { followups: { some: followupsFilters } },
      { helpRequests: { some: helpRequestsFilters } }
    ]
  }

  if (filters.cities) formattedFilters.city = { in: filters.cities }

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

export const getBeneficiariesHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetBeneficiariesInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where = {
    structureId: user.structureId,
    archived: null,
    ...prepareBeneficiaryFilters(input.filters)
  }

  const [beneficiaries, count] = await Promise.all([
    prismaClient.beneficiary.findMany({
      where,
      select: {
        id: true,
        usualName: true,
        birthName: true,
        firstName: true,
        birthDate: true,
        streetNumber: true,
        street: true,
        zipcode: true,
        city: true,
        phone1: true,
        phone2: true,
        status: true,
        fileNumber: true,
        referents: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        followups: {
          select: {
            types: { select: { id: true, name: true }, distinct: ['id'] }
          }
        },
        helpRequests: {
          select: { type: { select: { id: true, name: true } } },
          distinct: ['typeId']
        },
        _count: {
          select: { followups: true, helpRequests: true, referents: true }
        }
      },
      take,
      skip,
      orderBy: input.orderBy
    }),
    prismaClient.beneficiary.count({
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { beneficiaries, count, totalPages }
}
