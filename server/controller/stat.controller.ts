import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { Prisma } from '~/server/prisma/prismaClient'
import { StatFilterInput } from '~/server/schema/filter.schema'

function prepareDateFilters(filters: StatFilterInput) {
  return {
    ...(filters.fromDate && { gte: filters.fromDate }),
    ...(filters.toDate && { lte: filters.toDate })
  }
}

function prepareBeneficiaryFilters(filters: StatFilterInput) {
  const followupsFilters: { [k: string]: {} } = {}
  const helpRequestsFilters: { [k: string]: {} } = {}

  if (filters.fromDate || filters.toDate) {
    followupsFilters.created = helpRequestsFilters.created =
      prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    const typesListFilter = {
      id: { in: filters.followupTypes }
    }
    followupsFilters.types = { some: typesListFilter }
    helpRequestsFilters.type = typesListFilter
  }

  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.fromDate || filters.toDate || filters.followupTypes) {
    formattedFilters.OR = [
      { followups: { some: followupsFilters } },
      { helpRequests: { some: helpRequestsFilters } }
    ]
  }

  if (filters.cities) formattedFilters.city = { in: filters.cities }

  if (filters.referent) {
    formattedFilters.referents = { some: { id: { equals: filters.referent } } }
  }

  return formattedFilters
}

export const getAccommodationModeStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['accomodationMode'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { accomodationMode: 'desc' } }
  })
}

export const getAgeStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['birthDate'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { birthDate: 'desc' } }
  })
}

export const getBeneficiaryCountHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.count({
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    }
  })
}

export const getCSPStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['socioProfessionalCategory'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { socioProfessionalCategory: 'desc' } }
  })
}

export const getFamilyStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['familySituation'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { familySituation: 'desc' } }
  })
}

export const getGenderStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } }
  })
}

export const getMobilityStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['mobility'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { mobility: 'desc' } }
  })
}

export const getRegionStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['region'],
    where: {
      structureId: user.structureId,
      ...prepareBeneficiaryFilters(input)
    },
    _count: true,
    orderBy: { _count: { region: 'desc' } }
  })
}
