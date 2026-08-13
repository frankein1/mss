import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { idSchema } from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import { validateOneBelongsToStructure } from '~~/server/security'
import type { IdInput } from '~~/server/schema'
import { WorkshopNameRepo, WorkshopRepo } from '~~/server/database'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) =>
  validateOneBelongsToStructure(
    ctx.user,
    input.id,
    WorkshopRepo.findUniqueOrThrow
  )

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const res = await WorkshopRepo.delete(ctx.user, {
    where: { id },
    select: {
      id: true,
      workshopNameId: true
    }
  })
  const workshopCount = await WorkshopRepo.count(ctx.user, {
    where: { workshopNameId: res.workshopNameId, structureId: ctx.structure.id }
  })
  if (workshopCount === 0) {
    await WorkshopNameRepo.delete(ctx.user, {
      where: { id: res.workshopNameId },
      select: { id: true }
    })
  }

  return res.id
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
