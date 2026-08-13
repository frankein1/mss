import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { DeleteUserInput } from '~~/server/schema'
import { deleteUserShema } from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import {
  StructureRepo,
  UserRepo,
  WorkshopNameRepo,
  WorkshopRepo
} from '~~/server/database'
import { TRPCError } from '@trpc/server'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: DeleteUserInput
}) => {
  await throwIfUserIsNotAuthorized(ctx, input.id)

  return await UserRepo.delete(ctx.user, {
    select: { id: true },
    where: {
      id: input.id
    }
  })
}

const throwIfUserIsNotAuthorized = async (
  ctx: ProtectedAppContext,
  id: string
) => {
  if (ctx.user.id === id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Vous ne pouvez pas supprimer votre propre compte'
    })
  }

  const [user, structure, workshopCount, workshopNameCount] = await Promise.all(
    [
      UserRepo.findUnique(ctx.user, {
        select: {
          id: true,
          _count: {
            select: {
              referentFor: true,
              createdDocuments: true,
              createdSocialSupports: true,
              createdComments: true
            }
          }
        },
        where: { id }
      }),
      StructureRepo.findUniqueOrThrow(ctx.user, {
        select: { id: true, users: { select: { id: true, role: true } } },
        where: { id: ctx.structure.id }
      }),
      WorkshopRepo.count(ctx.user, { where: { createdById: id } }),
      WorkshopNameRepo.count(ctx.user, { where: { createdById: id } })
    ]
  )

  if (
    (user?._count.referentFor ?? 0) > 0 ||
    (user?._count.createdDocuments ?? 0) > 0 ||
    (user?._count.createdSocialSupports ?? 0) > 0 ||
    (user?._count.createdComments ?? 0) > 0 ||
    workshopCount > 0 ||
    workshopNameCount > 0
  ) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message:
        'Cet utilisateur à des données liées et ne peut pas être supprimé'
    })
  }

  if (structure.users.length === 1) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'La structure doit avoir au moins un utilisateur'
    })
  }

  const structureManagers = structure.users.filter(
    u => u.role === 'StructureManager'
  )
  if (structureManagers.length === 1 && structureManagers[0]?.id === id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Impossible de supprimer le dernier responsable de structure'
    })
  }
}

const securityCheck = (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions(ctx)
  return permissions.module.users
}

export const deleteUserMutation = createMutation({
  handler,
  inputValidation: deleteUserShema,
  securityCheck,
  auditLog: {
    key: 'user.delete',
    target: UserActivityObject.User,
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
