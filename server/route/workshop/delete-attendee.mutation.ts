import {
  UserActivityType,
  WorkshopAttendeeType
} from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { DeleteAttendeeInput } from '~/server/schema'
import { deleteAttendeeSchema } from '~/server/schema'
import {
  WorkshopAttendeeRepo,
  WorkshopExternalAttendeeRepo
} from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { badrequest } from '~/utils/api/errors'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { id, type },
  ctx
}: {
  input: DeleteAttendeeInput
  ctx: ProtectedAppContext
}) => {
  if (type === WorkshopAttendeeType.Beneficiary) {
    await WorkshopAttendeeRepo.delete(ctx.user, {
      where: {
        id: id,
        workshop: { structureId: ctx.structure.id }
      }
    })

    return { id, type }
  }

  if (type === WorkshopAttendeeType.External) {
    const { workshopExternalAttendeeId } =
      await WorkshopAttendeeRepo.findUniqueOrThrow(ctx.user, {
        select: { workshopExternalAttendeeId: true },
        where: { id }
      })

    if (!workshopExternalAttendeeId) {
      throw badrequest('workshop: external attendee id not found')
    }

    await WorkshopExternalAttendeeRepo.delete(ctx.user, {
      where: { id: workshopExternalAttendeeId }
    })

    return { id, type }
  }

  throw badrequest(
    'workshop: request not implemented for accompanying attendee'
  )
}

export const deleteAttendee = createMutation({
  inputValidation: deleteAttendeeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.deleteAttendee',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.DELETE
  }
})
