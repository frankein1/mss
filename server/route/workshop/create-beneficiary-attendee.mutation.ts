import {
  UserActivityType,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { CreateBeneficiaryAttendeeInput } from '~/server/schema'
import { createBeneficiaryAttendeeSchema } from '~/server/schema'
import {
  BeneficiaryRepo,
  WorkshopAttendeeRepo,
  WorkshopRepo
} from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'
import { prismaClient } from '~/server/prisma'
import { getListType } from '~/server/services/workshop/helper'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateBeneficiaryAttendeeInput
) => {
  try {
    const [workshops, _] = await Promise.all([
      WorkshopRepo.findMany(ctx.user, {
        select: { id: true },
        where: { structureId: ctx.structure.id, id: { in: input.workshopIds } }
      }),
      BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
        select: { id: true },
        where: { id: input.beneficiaryId }
      })
    ])

    // if one of the workshops does not belong to the structure the check fails
    if (workshops.length !== input.workshopIds.length) {
      throw new Error()
    }
  } catch {
    return false
  }

  return true
}

/** Add a beneficiary to one or several workshops */
const handler = async ({
  input: { workshopIds, beneficiaryId },
  ctx: { user }
}: {
  input: CreateBeneficiaryAttendeeInput
  ctx: ProtectedAppContext
}) => {
  return prismaClient.$transaction(async () => {
    const workshops = await getWorkshopList(user, workshopIds)
    const data: Array<{
      workshopId: string
      beneficiaryId: string
      type: WorkshopAttendeeType
      listType: WorkshopAttendeeListType
    }> = []

    workshops.forEach(workshop => {
      const countMainAttendees = workshop.workshopAttendees.filter(
        ({ listType }) => listType === WorkshopAttendeeListType.Main
      ).length
      const listType = getListType(countMainAttendees, workshop.attendeeLimit)

      data.push({
        workshopId: workshop.id,
        beneficiaryId: beneficiaryId,
        type: WorkshopAttendeeType.Beneficiary,
        listType: listType
      })
    })

    return await prismaClient.workshopAttendee.createManyAndReturn({
      data,
      select: {
        id: true,
        listType: true
      }
    })
  })
}

async function getWorkshopList(
  user: SecurityRuleContext['user'],
  workshopIds: string[]
) {
  const workshops = await WorkshopRepo.findMany(user, {
    where: { id: { in: workshopIds } },
    select: {
      id: true,
      attendeeLimit: true,
      workshopAttendees: {
        select: {
          listType: true
        }
      }
    }
  })
  return workshops
}

export const createBeneficiaryAttendee = createMutation({
  inputValidation: createBeneficiaryAttendeeSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.createBeneficiaryAttendee',
    target: 'Workshop',
    targetId: ({ input }) => input.workshopIds.join(', '),
    action: UserActivityType.CREATE
  }
})
