import { UserActivityType, UserRole, UserStatus } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { prismaClient } from '~~/server/prisma'
import { createEmail } from '~~/server/query'
import { createMutation } from '~~/server/route'
import type { AdminTransferUserInput } from '~~/server/schema'
import { adminTransferUserSchema } from '~~/server/schema'
import type { AdminContext } from '~~/server/trpc'
import { UserService } from '~~/server/services'
import {
  getSupportTransferEmailContent,
  getTargetStructureManagerTransferEmailContent,
  getTransferedUserEmailContent
} from '~~/server/email'
import { createEmailSubject } from '~~/server/email/createEmailSubject'
import { userRoleKeys } from '~~/client/options'
import { formatUserDisplayName } from '~/utils/user'
import { SUPPORT_EMAIL } from '~/utils/constants'
import { NotificationRepo, UserRepo } from '~~/server/database'
import {
  parseStructureTransferHistory,
  type StructureTransferHistoryEntry
} from '~~/server/schema/user/structureTransferHistory.schema'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: AdminTransferUserInput
}) => {
  const { userId, newStructureId, newRole, confirmationCode } = input

  await UserService.verifyAuthorizationCode({
    ctx,
    input: { code: confirmationCode }
  })

  const targetUser = await UserRepo.findUniqueOrThrow(ctx.user, {
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      structureId: true,
      structureTransferHistory: true,
      structure: { select: { id: true, name: true, disabled: true } }
    }
  })

  if (targetUser.role === UserRole.Administrator) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot transfer an Administrator'
    })
  }
  if (targetUser.status === UserStatus.Disabled) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot transfer a disabled user'
    })
  }
  if (!targetUser.structureId || !targetUser.structure) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot transfer a user with no structure'
    })
  }
  if (targetUser.structure.disabled) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot transfer a user from a disabled structure'
    })
  }
  if (newStructureId === targetUser.structureId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User already belongs to structure'
    })
  }

  const targetStructure = await prismaClient.structure.findUniqueOrThrow({
    where: { id: newStructureId },
    select: { id: true, name: true, disabled: true }
  })
  if (targetStructure.disabled) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot transfer a user to a disabled structure'
    })
  }

  const referentForCount = await prismaClient.familyFile.count({
    where: { referents: { some: { id: targetUser.id } } }
  })
  if (referentForCount > 0) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Cannot transfer a user who is still referent on ${referentForCount} family file(s). Use the referent transfer tool first.`
    })
  }

  const fromStructure = targetUser.structure
  const fromRole = targetUser.role

  const remainingStructureManagers = await prismaClient.user.count({
    where: {
      structureId: fromStructure.id,
      role: UserRole.StructureManager,
      status: UserStatus.Active,
      id: { not: targetUser.id }
    }
  })
  if (
    fromRole === UserRole.StructureManager &&
    remainingStructureManagers === 0
  ) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Cannot transfer the last structure manager of a structure'
    })
  }

  const existingHistory = parseStructureTransferHistory(
    targetUser.structureTransferHistory
  )
  const newEntry: StructureTransferHistoryEntry = {
    structureId: fromStructure.id,
    role: fromRole,
    leftAt: new Date()
  }
  const updatedHistory = [...existingHistory, newEntry]

  const [updatedUser, _] = await prismaClient.$transaction([
    UserRepo.update(ctx.user, {
      where: { id: targetUser.id },
      data: {
        structureId: newStructureId,
        role: newRole,
        structureTransferHistory: updatedHistory
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        structureId: true
      }
    }),
    NotificationRepo.prisma.deleteMany({
      where: {
        recipientId: targetUser.id,
        OR: [{ structureId: { not: newStructureId } }, { structureId: null }]
      }
    })
  ])

  const [targetManagers, adminUser] = await Promise.all([
    prismaClient.user.findMany({
      where: {
        structureId: newStructureId,
        role: UserRole.StructureManager,
        status: UserStatus.Active
      },
      select: { email: true }
    }),
    prismaClient.user.findUniqueOrThrow({
      where: { id: ctx.user.id },
      select: { firstName: true, lastName: true, email: true }
    })
  ])

  const config = useRuntimeConfig()
  const userDisplayName = formatUserDisplayName(targetUser)
  const newRoleLabel = userRoleKeys.value(newRole) ?? newRole
  const adminDisplayName = formatUserDisplayName(adminUser)

  const emailJobs: Promise<unknown>[] = [
    createEmail({
      config,
      to: targetUser.email,
      subject: createEmailSubject(
        'Mon Suivi Social - Votre compte a été transféré vers une nouvelle structure',
        config
      ),
      ...getTransferedUserEmailContent({
        userDisplayName,
        fromStructureName: fromStructure.name,
        toStructureName: targetStructure.name,
        newRoleLabel
      })
    }),
    ...targetManagers.map(manager =>
      createEmail({
        config,
        to: manager.email,
        subject: createEmailSubject(
          'Mon Suivi Social - Un nouvel utilisateur a rejoint votre structure',
          config
        ),
        ...getTargetStructureManagerTransferEmailContent({
          userDisplayName,
          userEmail: targetUser.email,
          toStructureName: targetStructure.name,
          newRoleLabel
        })
      })
    ),
    createEmail({
      config,
      to: SUPPORT_EMAIL,
      subject: createEmailSubject(
        "Mon Suivi Social - Transfert d'utilisateur",
        config
      ),
      ...getSupportTransferEmailContent({
        userDisplayName,
        userEmail: targetUser.email,
        fromStructureName: fromStructure.name,
        toStructureName: targetStructure.name,
        newRoleLabel,
        adminDisplayName,
        adminEmail: adminUser.email
      })
    })
  ]

  Promise.allSettled(emailJobs).then(results => {
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('transferUser email failure', result.reason)
      }
    }
  })

  return {
    ...updatedUser,
    fromStructureId: fromStructure.id,
    toStructureId: targetStructure.id,
    fromRole,
    toRole: newRole
  }
}

export const transferUser = createMutation({
  inputValidation: adminTransferUserSchema,
  adminHandler,
  auditLog: {
    key: 'admin.user.transfer',
    target: 'User',
    targetId: ({ input }) => {
      return input.userId
    },
    action: UserActivityType.UPDATE
  }
})
