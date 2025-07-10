import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateAttendeeAttendanceInput,
  updateAttendeeAttendanceSchema
} from '~/server/schema'
import { WorkshopAttendeeRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: UpdateAttendeeAttendanceInput
  ctx: ProtectedAppContext
}) =>
  WorkshopAttendeeRepo.update(ctx.user, {
    select: { id: true },
    where: {
      id: input.id,
      workshop: { structureId: ctx.structure.id }
    },
    data: {
      attendance: input.attendance
    }
  })

export const updateAttendeeAttendance = createMutation({
  inputValidation: updateAttendeeAttendanceSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.updateAttendeeAttendance',
    target: 'Workshop',
    targetId: ({ input }) => input.id,
    action: UserActivityType.UPDATE
  }
})
