import { UserActivityType, UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { UserRepo, StructureRepo } from '~~/server/database'
import { createOrUpdateUser } from '~~/server/integrations/brevo/service'
import { createMutation } from '~~/server/route'
import type { AdminEditUserInput } from '~~/server/schema'
import { adminEditUserSchema } from '~~/server/schema'
import type { AdminContext } from '~~/server/trpc'
import { cleanEmail } from '~/utils/user'
import { MSS_ERROR_CODES } from '~/utils/error'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: AdminEditUserInput
}) => {
  const { id, email, ...user } = input

  const targetUser = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id }
  })

  if (targetUser.role === UserRole.Administrator || !targetUser.structureId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot edit an Administrator'
    })
  }

  const hasChangedTargetStructure = user.structureId !== targetUser.structureId
  if (hasChangedTargetStructure) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot change the structure to which the user belongs',
      cause: {
        MSS_CODE: MSS_ERROR_CODES.ADMIN_CANNOT_CHANGE_USER_S_STRUCTURE
      }
    })
  }

  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: { id: targetUser.structureId }
  })
  if (structure.disabled) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot edit a user in a disabled structure'
    })
  }

  const updatedUser = await UserRepo.prisma.update({
    where: { id },
    data: {
      email: cleanEmail(email),
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      role: user.role,
      aidantConnectAuthorisation: user.aidantConnectAuthorisation
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      structureId: true,
      structure: { select: { name: true } },
      role: true,
      status: true,
      aidantConnectAuthorisation: true
    }
  })
  createOrUpdateUser(updatedUser.id).catch(error => {
    console.error(error)
  })

  return updatedUser
}

export const editUser = createMutation({
  inputValidation: adminEditUserSchema,
  adminHandler,
  auditLog: {
    key: 'admin.user.edit',
    target: 'User',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
