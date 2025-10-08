import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateAttendeeInput } from '~/server/schema'
import { updateAttendeeSchema } from '~/server/schema'
import { WorkshopAttendeeRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: UpdateAttendeeInput
  ctx: ProtectedAppContext
}) => {
  let data = {}
  const attendee = await WorkshopAttendeeRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.attendeeId },
    select: { type: true }
  })
  if (attendee.type === 'Beneficiary') {
    data = {
      comment: input.comment
    }
  } else if (attendee.type === 'External') {
    data = {
      comment: input.comment,
      workshopExternalAttendee: {
        update: {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          email: input.email,
          phone: input.phone,
          birthDate: input.birthDate,
          city: input.city
        }
      }
    }
  }
  return WorkshopAttendeeRepo.update(ctx.user, {
    select: { id: true },
    where: {
      id: input.attendeeId,
      workshop: { structureId: ctx.structure.id }
    },
    data
  })
}

export const updateAttendee = createMutation({
  inputValidation: updateAttendeeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.updateAttendee',
    target: 'Workshop',
    targetId: ({ input }) => input.attendeeId,
    action: UserActivityType.UPDATE
  }
})
