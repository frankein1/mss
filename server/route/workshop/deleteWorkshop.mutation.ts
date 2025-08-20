import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopRepo } from '~/server/database'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await WorkshopRepo.delete(ctx.user, {
    where: {
      id,
      structureId: ctx.structure.id
    },
    select: {
      id: true
    }
  })
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
