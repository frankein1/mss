import { NotificationType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import { updateBeneficiaryArchiveDate } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'
import { BeneficiaryRepo, NotificationRepo, UserRepo } from '~/server/database'
import dayjs from 'dayjs'
import { prismaClient } from '~/server/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: {
    id: string
  }
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.relatives
}

const handler = async ({
  input,
  ctx
}: {
  input: {
    id: string
  }
  ctx: ProtectedAppContext
}) => {
  const [user, ben] = await getUserAndBeneficiary(ctx, input.id)
  const archiveDueDate = dayjs().add(1, 'year').toDate()

  const updateBeneficiary = BeneficiaryRepo.prisma.update({
    where: { id: input.id },
    data: {
      updated: ben.updated, // ne modifie pas la date de dernière mise à jour
      archiveDueDate,
      archiveDueDateHistory: {
        push: archiveDueDate
      }
    }
  })

  const markNotificationsAsRead = NotificationRepo.prisma.updateMany({
    where: {
      OR: [
        { type: NotificationType.ArchiveDueToday },
        { type: NotificationType.ArchiveDueSevenDays },
        { type: NotificationType.ArchiveDueOneMonth }
      ],
      beneficiaryId: input.id
    },
    data: {
      read: true,
      archiveDate: archiveDueDate,
      detail: `Date d'archivage modifiée par ${user.firstName} ${user.lastName}`
    }
  })

  const [updatedBeneficiary, _] = await prismaClient.$transaction([
    updateBeneficiary,
    markNotificationsAsRead
  ])

  return updatedBeneficiary
}

export const updateArchiveDateMutation = createMutation({
  inputValidation: updateBeneficiaryArchiveDate,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateArchiveDate',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})

async function getUserAndBeneficiary(
  ctx: SecurityRuleContext,
  beneficiaryId: string
) {
  return await Promise.all([
    UserRepo.findUniqueOrThrow(ctx.user, {
      where: { id: ctx.user.id },
      select: {
        firstName: true,
        lastName: true
      }
    }),
    BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
      where: { id: beneficiaryId },
      select: {
        updated: true
      }
    })
  ])
}
