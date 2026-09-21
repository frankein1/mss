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
import { prismaClient } from '~~/server/prisma'
import { parseStructureTransferHistory } from '~~/server/schema/user/structureTransferHistory.schema'
import { userRoleKeys } from '~~/client/options'

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
      aidantConnectAuthorisation: true,
      structureTransferHistory: true
    }
  })
  createOrUpdateUser(updatedUser.id).catch(error => {
    console.error(error)
  })

  const history = parseStructureTransferHistory(
    updatedUser.structureTransferHistory
  )

  let formerStructures: {
    structureName: string
    roleLabel: string
    leftAt: Date
    disabled: boolean
  }[] = []

  if (history.length > 0) {
    const structureIds = [...new Set(history.map(e => e.structureId))]
    const structures = await prismaClient.structure.findMany({
      where: { id: { in: structureIds } },
      select: { id: true, name: true, disabled: true }
    })
    const structureMap = new Map(structures.map(s => [s.id, s]))

    formerStructures = history
      .map(entry => {
        const s = structureMap.get(entry.structureId)
        let structureName: string
        let disabled = false
        if (!s) {
          structureName = 'Structure inconnue'
        } else if (s.disabled || s.name === '') {
          structureName = 'Structure désactivée'
          disabled = true
        } else {
          structureName = s.name
        }
        return {
          structureName,
          roleLabel: userRoleKeys.value(entry.role) ?? entry.role,
          leftAt: entry.leftAt,
          disabled
        }
      })
      .sort((a, b) => b.leftAt.getTime() - a.leftAt.getTime())
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    structureId: updatedUser.structureId,
    structure: updatedUser.structure,
    role: updatedUser.role,
    status: updatedUser.status,
    aidantConnectAuthorisation: updatedUser.aidantConnectAuthorisation,
    formerStructures
  }
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
