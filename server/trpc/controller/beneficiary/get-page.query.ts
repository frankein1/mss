import { Prisma } from '@prisma/client'
import { createQuery } from '../../request/createRequest'
import { GetBeneficiariesInput, getBeneficiariesSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prismaClient } from '~/server/prisma'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { getBeneficiaryFollowUpTypes } from '~/utils'
import { prepareBeneficiaryFilters } from '~/utils/filters'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user, structure }
}: {
  input: GetBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const referentsCondition = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.BeneficiaryWhereInput = {
    structureId: structure.id,
    archived: null,
    referents: referentsCondition,
    ...prepareBeneficiaryFilters(
      input.filters,
      canOnlyListItsBeneficiaries(user)
    )
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

export type GetBeneficiariesOutput = Prisma.PromiseReturnType<typeof handler>

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

export const getBeneficiariesQuery = createQuery({
  path: 'getBeneficiaries',
  inputValidation: getBeneficiariesSchema,
  securityCheck,
  handler
})
