import { Prisma, UserActivityType } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { canOnlyListItsBeneficiaries } from '~/server/security/rules'
import { PaginatedInput, paginatedSchema } from '~/server/schema'
import { takeAndSkipFromPagination } from '~/utils/table'
import { AllowSecurityCheck } from '~/server/security/rules/types'

function getAnyBeneficiariesUsersActivity(
  structureId: string,
  take: number,
  skip: number
) {
  return prismaClient.userActivity.findMany({
    where: {
      structureId,
      object: 'Beneficiary',
      activity: { in: ['CREATE', 'ARCHIVE', 'DELETE'] }
    },
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

function getAnyBeneficiariesUsersActivityCount(structureId: string) {
  return prismaClient.userActivity.count({
    where: {
      structureId,
      object: 'Beneficiary',
      activity: { in: ['CREATE', 'ARCHIVE', 'DELETE'] }
    }
  })
}

async function getOnlyItsBeneficiariesUsersActivity(
  userId: string,
  structureId: string,
  take: number,
  skip: number
) {
  const rawResult = await prismaClient.$queryRaw<
    Array<{
      id: string
      date: Date
      activity: UserActivityType
      object_id: string
      first_name: string
      last_name: string
    }>
  >(Prisma.sql`
select "ua"."id", "ua"."date", "ua"."activity", "ua"."object_id", "u"."first_name", "u"."last_name"
from "user_activity" ua
inner join "user" u
  on "ua"."user_id" = "u"."id"
inner join "beneficiary" b
  on "b"."id" = uuid("ua"."object_id")
inner join "_beneficiary_referents" br
  on "br"."A" = "b"."id"
where
  "ua"."structure_id" = uuid(${structureId}) and
  "ua"."object" = 'Beneficiary' and
  "ua"."activity" in ('CREATE', 'ARCHIVE', 'DELETE') and
  "br"."B" = uuid(${userId})
order by "ua"."date" asc
limit ${take}
offset ${skip};
`)

  const activity = rawResult.map(
    ({
      first_name: firstName,
      last_name: lastName,
      object_id: objectId,
      ...rest
    }) => ({
      ...rest,
      objectId,
      user: { firstName, lastName }
    })
  )

  return activity
}

async function getOnlyItsBeneficiariesUsersActivityCount(
  userId: string,
  structureId: string
) {
  const [{ count }] = await prismaClient.$queryRaw<
    Array<{
      count: number
    }>
  >(Prisma.sql`
select count(*)
from "user_activity" ua
inner join "beneficiary" b
  on "b"."id" = uuid("ua"."object_id")
inner join "_beneficiary_referents" br
  on "br"."A" = "b"."id"
where
  "ua"."structure_id" = uuid(${structureId}) and
  "ua"."object" = 'Beneficiary' and
  "ua"."activity" in ('CREATE', 'ARCHIVE', 'DELETE') and
  "br"."B" = uuid(${userId});
`)

  return count
}

function getBeneficiariesUsersActivity(
  ctx: ProtectedAppContext,
  take: number,
  skip: number
) {
  const { user, structure } = ctx
  if (canOnlyListItsBeneficiaries(user)) {
    return getOnlyItsBeneficiariesUsersActivity(
      user.id,
      structure.id,
      take,
      skip
    )
  }
  return getAnyBeneficiariesUsersActivity(structure.id, take, skip)
}

function getBeneficiariesUsersActivityCount(ctx: ProtectedAppContext) {
  const { user, structure } = ctx
  if (canOnlyListItsBeneficiaries(user)) {
    return getOnlyItsBeneficiariesUsersActivityCount(user.id, structure.id)
  }
  return getAnyBeneficiariesUsersActivityCount(structure.id)
}

const handler = async ({
  input,
  ctx
}: {
  input: PaginatedInput
  ctx: ProtectedAppContext
}) => {
  const { take, skip } = takeAndSkipFromPagination(input)

  const [activity, count] = await Promise.all([
    getBeneficiariesUsersActivity(ctx, take, skip),
    getBeneficiariesUsersActivityCount(ctx)
  ])

  return { activity, count }
}

export type GetBeneficiariesUsersActivityOutput = Prisma.PromiseReturnType<
  typeof handler
>

export const getBeneficiariesUsersActivityQuery = createQuery({
  inputValidation: paginatedSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
