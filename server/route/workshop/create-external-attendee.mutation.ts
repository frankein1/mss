import {
  UserActivityType,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { CreateExternalAttendeeServerInput } from '~~/server/schema'
import { createExternalAttendeeSchema } from '~~/server/schema'
import { WorkshopAttendeeRepo, WorkshopRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateExternalAttendeeServerInput
) => {
  try {
    await WorkshopRepo.findUniqueOrThrow(ctx.user, {
      select: { id: true },
      where: { id: input.workshopId }
    })
  } catch {
    return false
  }

  return true
}

const handler = async ({
  input,
  ctx
}: {
  input: CreateExternalAttendeeServerInput
  ctx: ProtectedAppContext
}) => {
  const { workshopId, comment } = input

  const workshop = await WorkshopRepo.findUniqueOrThrow(ctx.user, {
    select: {
      structureId: true,
      attendeeLimit: true,
      _count: { select: { workshopAttendees: true } }
    },
    where: { id: workshopId }
  })

  const listType =
    workshop.attendeeLimit &&
    workshop._count.workshopAttendees >= workshop.attendeeLimit
      ? WorkshopAttendeeListType.Waiting
      : WorkshopAttendeeListType.Main

  return WorkshopAttendeeRepo.create(ctx.user, {
    select: { id: true },
    data: {
      workshop: { connect: { id: workshopId } },
      type: WorkshopAttendeeType.External,
      listType,
      comment,
      paymentReceived: input.paymentReceived,
      // if paymentReceived is false, paymentAmount should always be null
      paymentAmount: !input.paymentReceived ? null : input.paymentAmount,
      workshopExternalAttendee: {
        create: {
          gender: input.gender,
          lastName: input.lastName,
          firstName: input.firstName,
          birthDate: input.birthDate,
          phone: input.phone,
          email: input.email,
          city: input.city
        }
      }
    }
  })
}

export const createExternalAttendee = createMutation({
  inputValidation: createExternalAttendeeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.createExternalAttendee',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
