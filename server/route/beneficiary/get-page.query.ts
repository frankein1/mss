import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetBeneficiariesInput, getBeneficiariesSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { prepareBeneficiaryFilters } from '~/utils/filters'
import {
  AllowSecurityCheck,
  SecurityRuleGrantee
} from '~/server/security/rules/types'
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
    getBeneficiaries(user, where, take, skip, input.orderBy),
    BeneficiaryRepo.count(user, {
      where
    })
  ])
  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return {
    beneficiaries,
    count,
    totalPages
  }
}

function getBeneficiaries(
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
      followupTypes: {
        select: {
          typeId: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
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

export const getBeneficiariesQuery = createQuery({
  inputValidation: getBeneficiariesSchema,
  securityCheck,
  handler
})
