import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import { WorkshopAttendeeRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) =>
  WorkshopAttendeeRepo.delete(ctx.user, {
    select: { id: true },
    where: {
      id: input.id,
      workshop: { structureId: ctx.structure.id }
    }
  })

export const deleteAttendee = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.deleteAttendee',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.DELETE
  }
})
