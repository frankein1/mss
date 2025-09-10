import {
  UserActivityType,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { CreateAttendeeInput } from '~/server/schema'
import { createAttendeeSchema } from '~/server/schema'
import {
  BeneficiaryRepo,
  WorkshopAttendeeRepo,
  WorkshopRepo
} from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'
import { getOne } from './get.query'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateAttendeeInput
) => {
  try {
    await Promise.all([
      WorkshopRepo.findUniqueOrThrow(ctx.user, {
        select: { id: true },
        where: { id: input.workshopId }
      }),
      BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
        select: { id: true },
        where: { id: input.beneficiaryId }
      })
    ])
  } catch {
    return false
  }

  return true
}

/** Can only add an attendee who is a beneficiary */
const handler = async ({
  input,
  ctx
}: {
  input: CreateAttendeeInput
  ctx: ProtectedAppContext
}) => {
  const workshop = await getOne(ctx.user, input.workshopId)

  const listType =
    workshop.attendeeLimit !== null &&
    workshop._count.mainAttendees >= workshop.attendeeLimit
      ? WorkshopAttendeeListType.Waiting
      : WorkshopAttendeeListType.Main

  return WorkshopAttendeeRepo.create(ctx.user, {
    select: { id: true },
    data: {
      ...input,
      type: WorkshopAttendeeType.Beneficiary,
      listType
    }
  })
}

export const createAttendee = createMutation({
  inputValidation: createAttendeeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.createAttendee',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
