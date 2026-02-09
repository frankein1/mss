import { UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateAttendeeServerInput } from '~/server/schema'
import { updateAttendeeSchema } from '~/server/schema'
import { WorkshopAttendeeRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: UpdateAttendeeServerInput
  ctx: ProtectedAppContext
}) => {
  let data = {}
  const attendee = await WorkshopAttendeeRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.attendeeId },
    select: { type: true }
  })
  const sharedData = {
    comment: input.comment,
    paymentReceived: input.paymentReceived,
    // if paymentReceived is false, paymentAmount should always be null
    paymentAmount: !input.paymentReceived ? null : input.paymentAmount
  }
  if (attendee.type === 'Beneficiary') {
    data = sharedData
  } else if (attendee.type === 'External') {
    data = {
      ...sharedData,
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
