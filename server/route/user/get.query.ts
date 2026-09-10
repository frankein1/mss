import { createQuery } from '~~/server/route'
import { forbiddenError, type ProtectedAppContext } from '~~/server/trpc'
import type { GetUserInput } from '~~/server/schema'
import { getUserSchema } from '~~/server/schema'
import { UserRepo, WorkshopNameRepo, WorkshopRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security/rules/types'
import { getAppContextPermissions } from '~~/server/security'
import { UserRole, type Prisma } from '@prisma/client'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.users

const handler = async ({
  ctx,
  input: { id }
}: {
  ctx: ProtectedAppContext
  input: GetUserInput
}) => {
  // Improvement : the counts should be added to the query only in the context of user deletion
  const user = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      aidantConnectAuthorisation: true,
      externalRdvspId: true,
      _count: {
        select: {
          referentFor: true,
          createdDocuments: true,
          createdSocialSupports: true,
          createdComments: true,
          archivedBeneficiaries2: true,
          RedirectionReasons: true,
          supportProgramNames: true
        }
      }
    }
  })

  if (user.role === UserRole.Administrator) {
    throw forbiddenError(
      'Cannot have an Administrator among user-managed users'
    )
  }

  const workshopCount = await WorkshopRepo.count(ctx.user, {
    where: {
      createdById: id
    }
  })

  const workshopNamesCount = await WorkshopNameRepo.count(ctx.user, {
    where: {
      createdById: id
    }
  })

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    aidantConnectAuthorisation: user.aidantConnectAuthorisation,
    externalRdvspId: user.externalRdvspId,
    _count: {
      referentFor: user._count.referentFor,
      createdDocuments: user._count.createdDocuments,
      createdSocialSupports: user._count.createdSocialSupports,
      createdComments: user._count.createdComments,
      workshops: workshopCount,
      workshopNames: workshopNamesCount,
      archivedBeneficiaries: user._count.archivedBeneficiaries2,
      redirectionReasons: user._count.RedirectionReasons,
      supportProgramNames: user._count.supportProgramNames
    }
  }
}

export type SructureUser = Prisma.PromiseReturnType<typeof handler>

export const getUserQuery = createQuery({
  inputValidation: getUserSchema,
  securityCheck,
  handler
})
