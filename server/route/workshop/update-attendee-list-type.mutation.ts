import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { UpdateAttendeeListTypeInput } from '~~/server/schema'
import { updateAttendeeListTypeSchema } from '~~/server/schema'
import { WorkshopAttendeeRepo } from '~~/server/database'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { getOne } from './get.query'
import { TRPCError } from '@trpc/server'
import { MSS_ERROR_CODES } from '~/utils/error'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: UpdateAttendeeListTypeInput
  ctx: ProtectedAppContext
}) => {
  const { workshopId } = await WorkshopAttendeeRepo.findUniqueOrThrow(
    ctx.user,
    { select: { workshopId: true }, where: { id: input.id } }
  )
  const workshop = await getOne(ctx.user, workshopId)
  if (workshop.attendeeLimit === workshop._count.mainAttendees) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Workshop ${workshopId} is already full`,
      cause: {
        MSS_CODE: MSS_ERROR_CODES.WORKSHOP_ALREADY_FULL
      }
    })
  }
  return WorkshopAttendeeRepo.update(ctx.user, {
    select: { id: true },
    where: {
      id: input.id,
      workshop: { structureId: ctx.structure.id }
    },
    data: {
      listType: input.listType
    }
  })
}

export const updateAttendeeListType = createMutation({
  inputValidation: updateAttendeeListTypeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.updateAttendeeListType',
    target: 'Workshop',
    targetId: ({ input }) => input.id,
    action: UserActivityType.UPDATE
  }
})
