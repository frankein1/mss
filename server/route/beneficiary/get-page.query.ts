import { Prisma } from '@prisma/client'
import { getBeneficiaryFollowUpTypes } from './helper/getBeneficiaryFollowUpTypes'
import { createQuery } from '~/server/route'
import { GetBeneficiariesInput, getBeneficiariesSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prepareBeneficiaryFilters } from '~/utils/filters'
import { AllowSecurityCheck, SecurityRuleGrantee } from '~/server/security'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user }
}: {
  input: GetBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }

  const [beneficiaries, count] = await Promise.all([
    getBeneficiariesWithFollowupTypesFromFollowupsAndHelpRequests(
      user,
      where,
      take,
      skip,
      input.orderBy
    ),
    BeneficiaryRepo.count(user, {
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
  user: SecurityRuleGrantee,
  where: Prisma.BeneficiaryWhereInput,
  take: number,
  skip: number,
  orderBy: Prisma.Enumerable<Prisma.BeneficiaryOrderByWithRelationAndSearchRelevanceInput>
) {
  return BeneficiaryRepo.findMany(user, {
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
  inputValidation: getBeneficiariesSchema,
  securityCheck,
  handler
})
