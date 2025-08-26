import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopNameRepo, WorkshopRepo } from '~/server/database'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { workshopNameId } = await WorkshopRepo.delete(ctx.user, {
    where: {
      id,
      structureId: ctx.structure.id
    },
    select: {
      id: true,
      workshopNameId: true
    }
  })
  const workshopCount = await WorkshopRepo.count(ctx.user, {
    where: { workshopNameId, structureId: ctx.structure.id }
  })
  if (workshopCount === 0) {
    await WorkshopNameRepo.delete(ctx.user, {
      where: { id: workshopNameId },
      select: { id: true }
    })
  }
}

export const deleteWorkshop = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.delete',
    target: 'Workshop',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
