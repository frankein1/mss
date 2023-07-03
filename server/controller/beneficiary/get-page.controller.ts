import { Prisma } from '@prisma/client'
import { BeneficiaryFilterInput, GetBeneficiariesInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'
import { FollowupTypeIdAndName } from '~/types/followupType'

type FollowupTypeSet = { [id: string]: FollowupTypeIdAndName }

export const getBeneficiariesHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  const { structureId } = user

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const referentsCondition = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.BeneficiaryWhereInput = {
    structureId,
    archived: null,
    referents: referentsCondition,
    ...prepareBeneficiaryFilters(input.filters)
  }

  const [beneficiaries, count] = await Promise.all([
    getBeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests(
      where,
      take,
      skip,
      input.orderBy
    ),
    prismaClient.beneficiary.count({
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return {
    beneficiaries: prepareBeneficiariesWithFollowupTypes(beneficiaries),
    count,
    totalPages
  }
}

export type GetBeneficiariesOutput = Prisma.PromiseReturnType<
  typeof getBeneficiariesHandler
>

function prepareBeneficiaryFilters(filters: BeneficiaryFilterInput) {
  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.followupTypes) {
    const typesListFilter: Prisma.FollowupTypeWhereInput = {
      id: { in: filters.followupTypes }
    }

    formattedFilters.OR = [
      { followups: { some: { types: { some: typesListFilter } } } },
      { helpRequests: { some: { type: typesListFilter } } }
    ]
  }

  if (filters.cities) {
    formattedFilters.city = { in: filters.cities }
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

function getBeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests(
  where: Prisma.BeneficiaryWhereInput,
  take: number,
  skip: number,
  orderBy: Prisma.Enumerable<Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput>
) {
  return prismaClient.beneficiary.findMany({
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
    orderBy
  })
}

export type BeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests =
  Prisma.PromiseReturnType<
    typeof getBeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests
  >

export type BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests =
  BeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests[0]

export type FollowupTypesFromFollowups =
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests['followups']
export type FollowupTypesFromHelpRequests =
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests['helpRequests']

function prepareBeneficiariesWithFollowupTypes(
  beneficiaries: BeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests
) {
  return beneficiaries.map(({ followups, helpRequests, ...beneficiary }) => ({
    followupTypes: getBeneficiaryFollowUpTypes({
      followups,
      helpRequests
    }),
    ...beneficiary
  }))
}

function getBeneficiaryFollowUpTypes({
  followups,
  helpRequests
}: Pick<
  BeneficiaryWithFollowupTypesFromFollowupsAndHelpRequests,
  'followups' | 'helpRequests'
>): FollowupTypeIdAndName[] {
  const uniqueFollowUpTypesTuples = {
    ...getUniqueFollowUpTypesTuplesFromFollowups(followups),
    ...getUniqueFollowUpTypesTuplesFromHelpRequests(helpRequests)
  }
  const followUpTypes = Object.values(uniqueFollowUpTypesTuples)
  return followUpTypes.sort(sortFollowupTypesByName)
}

function getUniqueFollowUpTypesTuplesFromFollowups(
  followups: FollowupTypesFromFollowups
) {
  return followups.reduce((uniques, followup) => {
    if (!followup.types.length) {
      return uniques
    }
    const followupUniqueFollowUpTypes = getUniqueFollowUpTypesFromFollowup(
      followup.types
    )
    return {
      ...uniques,
      ...followupUniqueFollowUpTypes
    }
  }, {} as FollowupTypeSet)
}

function getUniqueFollowUpTypesFromFollowup(
  followUpTypesArr: FollowupTypesFromFollowups[0]['types']
) {
  return followUpTypesArr.reduce(
    (uniques, f) => ({
      ...uniques,
      [f.id]: f
    }),
    {} as FollowupTypeSet
  )
}

function getUniqueFollowUpTypesTuplesFromHelpRequests(
  helpRequests: FollowupTypesFromHelpRequests
) {
  return helpRequests.reduce((uniques, helpRequest) => {
    if (!helpRequest.type) {
      return uniques
    }
    return {
      ...uniques,
      [helpRequest.type.id]: helpRequest.type
    }
  }, {} as FollowupTypeSet)
}
