import type { Prisma } from '@prisma/client'
import { ProtectedAppContext, ProtectedAppContextUser } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import type { PaginatedInput } from '~/server/schema'
import { takeAndSkipFromPagination } from '~/utils/table'

function getBeneficiariesUsersActivity(
  where: Prisma.UserActivityWhereInput,
  take: number,
  skip: number
) {
  return prismaClient.userActivity.findMany({
    where,
    select: {
      id: true,
      date: true,
      activity: true,
      objectId: true,
      user: {
        select: { firstName: true, lastName: true }
      }
    },
    orderBy: {
      date: 'asc'
    },
    take,
    skip
  })
}

type BeneficiariesUsersActivityOutput = Prisma.PromiseReturnType<
  typeof getBeneficiariesUsersActivity
>

function getBeneficiariesUsersActivityWithCount(
  structureId: string,
  take: number,
  skip: number
) {
  const where: Prisma.UserActivityWhereInput = {
    structureId,
    object: 'Beneficiary',
    activity: { in: ['CREATE', 'ARCHIVE', 'DELETE'] }
  }

  return Promise.all([
    getBeneficiariesUsersActivity(where, take, skip),
    prismaClient.userActivity.count({ where })
  ])
}

async function filterAuthorizedBeneficiaries(
  user: ProtectedAppContextUser,
  beneficiariesUsersActivity: BeneficiariesUsersActivityOutput
) {
  if (!canOnlyListItsBeneficiaries(user)) {
    return beneficiariesUsersActivity
  }

  const beneficiaryIds = beneficiariesUsersActivity.map(
    ({ objectId }) => objectId
  )

  const authorizedBeneficiaries = await prismaClient.beneficiary.findMany({
    where: {
      id: {
        in: beneficiaryIds
      },
      referents: { some: { id: user.id } }
    },
    select: { id: true }
  })

  const authorizedBeneficiaryIds = authorizedBeneficiaries.map(({ id }) => id)

  return beneficiariesUsersActivity.filter(({ objectId }) =>
    authorizedBeneficiaryIds.includes(objectId)
  )
}

export const getBeneficiariesUsersActivityHandler = async ({
  input,
  ctx: { user }
}: {
  input: PaginatedInput
  ctx: ProtectedAppContext
}) => {
  // TODO: Pagination
  const { take, skip } = takeAndSkipFromPagination(input)

  const [beneficiariesUsersActivity, count] =
    await getBeneficiariesUsersActivityWithCount(user.structureId, take, skip)

  // FIXME: Due to object relation being unknown by Prisma, the referent condition can not be applied directly
  return {
    activity: await filterAuthorizedBeneficiaries(
      user,
      beneficiariesUsersActivity
    ),
    count
  }
}

export type GetBeneficiariesUsersActivityOutput = Prisma.PromiseReturnType<
  typeof getBeneficiariesUsersActivityHandler
>
