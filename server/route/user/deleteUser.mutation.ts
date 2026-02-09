import { UserActivityObject, UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { DeleteUserInput } from '~/server/schema'
import { deleteUserShema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { StructureRepo, UserRepo } from '~/server/database'
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
    where: {
      id: input.id
    }
  })
}

const throwIfUserIsNotAuthorized = async (
  ctx: ProtectedAppContext,
  id: string
) => {
  // user is referent
  const user = await UserRepo.findUnique(ctx.user, {
    select: { id: true, referentFor: true },
    where: {
      id
    }
  })
  if (user && user.referentFor && user?.referentFor.length > 0) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User his referent'
    })
  }

  if (ctx.user.id === id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Userannot delete his own account'
    })
  }

  // user is the last one
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    select: { id: true, users: { select: { id: true, role: true } } },
    where: {
      id: ctx.structure.id
    }
  })
  if (structure.users.length === 1) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Must be at least one user in structure'
    })
  }

  const structureManagers = structure.users.filter(
    u => u.role === 'StructureManager'
  )
  if (structureManagers.length === 1 && structureManagers[0]?.id === id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot delete last structure manager'
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
