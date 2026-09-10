import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { GetUserInput } from '~~/server/schema'
import { getUserSchema } from '~~/server/schema'
import { UserRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security/rules/types'
import { getAppContextPermissions } from '~~/server/security'
import type { Prisma } from '@prisma/client'
import type { UserBlockingRelation } from '~~/client/labels'
import type { NonAdminUserRole } from '~~/types/user'

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

    return { ...user, role: user.role as NonAdminUserRole, _count: undefined }
  }

  const { _count, ...user } = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: { ...userSelect, _count: { select: blockingRelationsSelect } }
  })

  return {
    ...user,
    role: user.role as NonAdminUserRole,
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
