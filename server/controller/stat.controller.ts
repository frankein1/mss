import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { Prisma } from '~/server/prisma/prismaClient'
import { StatFilterInput } from '~/server/schema'

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

function prepareHelpRequestFilters(filters: StatFilterInput) {
  const formattedFilters: Prisma.HelpRequestWhereInput = {}

  if (filters.fromDate || filters.toDate) {
    formattedFilters.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    formattedFilters.type = { id: { in: filters.followupTypes } }
  }

  if (filters.cities) {
    formattedFilters.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    formattedFilters.createdBy = { id: filters.referent }
  }

  return formattedFilters
}

function prepareFollowupFilters(filters: StatFilterInput) {
  const formattedFilters: Prisma.FollowupWhereInput = {}

  if (filters.fromDate || filters.toDate) {
    formattedFilters.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.cities) {
    formattedFilters.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    formattedFilters.createdBy = { id: filters.referent }
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

export const getFinancialHelpRequestsStats = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.helpRequest.findMany({
    where: {
      structureId: user.structureId,
      financialSupport: true,
      ...prepareHelpRequestFilters(input)
    },
    select: {
      allocatedAmount: true,
      externalStructure: true,
      type: {
        select: {
          id: true,
          name: true
        }
      },
      status: true
    }
  })
}

export const getFollowupActionsEntreprisesStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.findMany({
    where: {
      structureId: user.structureId,
      OR: [{ redirected: true }, { helpRequested: true }],
      ...prepareFollowupFilters(input)
    },
    select: {
      redirected: true,
      helpRequested: true
    }
  })
}

export const getFollowupMediumStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.groupBy({
    by: ['medium'],
    where: {
      structureId: user.structureId,
      ...prepareFollowupFilters(input)
    },
    _count: true,
    orderBy: { _count: { medium: 'desc' } }
  })
}

export const getFollowupMinistreStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.groupBy({
    by: ['ministre'],
    where: {
      structureId: user.structureId,
      ...prepareFollowupFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}

export const getFollowupPrescribingOrganizationStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.findMany({
    where: {
      structureId: user.structureId,
      ...prepareFollowupFilters(input)
    },
    select: {
      prescribingOrganization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

export const getFollowupStatusStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followup.groupBy({
    by: ['status'],
    where: {
      structureId: user.structureId,
      ...prepareFollowupFilters(input)
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
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

export const getHelpRequestMinistreStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.helpRequest.groupBy({
    by: ['ministre'],
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestFilters(input)
    },
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}

export const getHelpRequestPrescribingOrganizationStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.helpRequest.findMany({
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestFilters(input)
    },
    select: {
      prescribingOrganization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

export const getHelpRequestStatusStatsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.helpRequest.groupBy({
    by: ['status'],
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestFilters(input)
    },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}

export const getHistoryCountsHandler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  const helpRequests = await prismaClient.helpRequest.count({
    where: {
      structureId: user.structureId,
      ...prepareHelpRequestFilters(input)
    }
  })
  const followups = await prismaClient.followup.count({
    where: {
      structureId: user.structureId,
      ...prepareFollowupFilters(input)
    }
  })
  const firstFollowups = await prismaClient.followup.count({
    where: {
      structureId: user.structureId,
      firstFollowup: true,
      ...prepareFollowupFilters(input)
    }
  })
  return { helpRequests, followups, firstFollowups }
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

export const getSupportStatsHandler = async ({
  input: _,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: AppContext
}) => {
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  // TODO: filters are not applied here
  return await prismaClient.followupType.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          followups: { where: { structureId: user.structureId } },
          helpRequests: { where: { structureId: user.structureId } }
        }
      }
    }
  })
}
