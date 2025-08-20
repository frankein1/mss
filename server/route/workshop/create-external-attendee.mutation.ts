import {
  UserActivityType,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateExternalAttendeeInput,
  createExternalAttendeeSchema
} from '~/server/schema'
import { WorkshopAttendeeRepo, WorkshopRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateExternalAttendeeInput
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
  input: CreateExternalAttendeeInput
  ctx: ProtectedAppContext
}) => {
  const { workshopId, comment, ...rest } = input

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
      workshopExternalAttendee: {
        create: {
          ...rest
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
