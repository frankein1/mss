import { createQuery } from '~~/server/route'
import { forbiddenError, type ProtectedAppContext } from '~~/server/trpc'
import type { GetUserInput } from '~~/server/schema'
import { getUserSchema } from '~~/server/schema'
import { UserRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security/rules/types'
import { getAppContextPermissions } from '~~/server/security'
import { UserRole, type Prisma } from '@prisma/client'
import type { UserBlockingRelation } from '~~/client/labels'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.users

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  status: true,
  aidantConnectAuthorisation: true,
  externalRdvspId: true
} as const satisfies Prisma.UserSelect

/** Relations whose foreign key blocks a deletion, only the delete page needs them */
const blockingRelationsSelect = {
  referentFor: true,
  createdDocuments: true,
  createdSocialSupports: true,
  createdComments: true,
  Workshop: true,
  WorkshopName: true,
  archivedBeneficiaries2: true,
  RedirectionReasons: true,
  supportProgramNames: true
} as const satisfies Prisma.UserCountOutputTypeSelect

const handler = async ({
  ctx,
  input: { id, withCounts }
}: {
  ctx: ProtectedAppContext
  input: GetUserInput
}) => {
  if (!withCounts) {
    const user = await UserRepo.findUniqueOrThrow(ctx.user, {
      where: { id },
      select: userSelect
    })

    if (user.role === UserRole.Administrator) {
      throw forbiddenError(
        'Cannot have an Administrator among user-managed users'
      )
    }

    // Spread first, then the narrowed role, which the spread alone would widen
    return { ...user, role: user.role, _count: undefined }
  }

  const { _count, ...user } = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: { ...userSelect, _count: { select: blockingRelationsSelect } }
  })

  if (user.role === UserRole.Administrator) {
    throw forbiddenError(
      'Cannot have an Administrator among user-managed users'
    )
  }

  return {
    ...user,
    role: user.role,
    _count: {
      referentFor: _count.referentFor,
      createdDocuments: _count.createdDocuments,
      createdSocialSupports: _count.createdSocialSupports,
      createdComments: _count.createdComments,
      workshops: _count.Workshop,
      workshopNames: _count.WorkshopName,
      archivedBeneficiaries: _count.archivedBeneficiaries2,
      redirectionReasons: _count.RedirectionReasons,
      supportProgramNames: _count.supportProgramNames
    } satisfies Record<UserBlockingRelation, number>
  }
}

export type SructureUser = Prisma.PromiseReturnType<typeof handler>

export const getUserQuery = createQuery({
  inputValidation: getUserSchema,
  securityCheck,
  handler
})
