import {
  UserActivityType,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { RegisterBeneficiariesInput } from '~/server/schema'
import { registerBeneficiariesSchema } from '~/server/schema'
import type {
  SecurityRuleContext,
  SecurityRuleGrantee
} from '~/server/security'

import { prismaClient } from '~/server/prisma'
import { BeneficiaryRepo, WorkshopRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: RegisterBeneficiariesInput
) => {
  try {
    const [workshops, beneficiaries] = await Promise.all([
      WorkshopRepo.findMany(ctx.user, {
        select: { id: true },
        where: { id: { in: input.workshopIds } }
      }),
      BeneficiaryRepo.findMany(ctx.user, {
        select: { id: true },
        where: { id: { in: input.beneficiaryIds } }
      })
    ])
    if (workshops.length === 0 || beneficiaries.length === 0) {
      throw new Error()
    }
  } catch {
    return false
  }
  return true
}

const handler = async ({
  input,
  ctx
}: {
  input: RegisterBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  return await createAttendeesTransaction(
    input.workshopIds,
    input.beneficiaryIds,
    ctx.user
  )
}

const createAttendeesTransaction = (
  workshopIds: string[],
  beneficiaryIds: string[],
  user: SecurityRuleGrantee
) => {
  return prismaClient.$transaction(async () => {
    const workshops: WorkshopWithAttendeeCount = await getWorkshopList(
      user,
      workshopIds
    )
    const data: Array<{
      workshopId: string
      beneficiaryId: string
      type: WorkshopAttendeeType
      listType: WorkshopAttendeeListType
    }> = []

    workshops.forEach(workshop => {
      const limit = workshop.attendeeLimit
      const mainAttendeesLength = workshop.workshopAttendees.filter(
        attendee => attendee.listType === WorkshopAttendeeListType.Main
      ).length

      beneficiaryIds.forEach((beneficiaryId, index) => {
        const listType =
          limit !== null && limit - mainAttendeesLength - index <= 0
            ? WorkshopAttendeeListType.Waiting
            : WorkshopAttendeeListType.Main

        data.push({
          workshopId: workshop.id,
          beneficiaryId: beneficiaryId,
          type: WorkshopAttendeeType.Beneficiary,
          listType: listType
        })
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

const getWorkshopList = async (
  user: SecurityRuleGrantee,
  workshopIds: string[]
) => {
  const workshops = await WorkshopRepo.findMany(user, {
    where: { id: { in: workshopIds } },
    select: {
      id: true,
      attendeeLimit: true,
      workshopAttendees: {
        select: {
          listType: true
        }
      },
      _count: true
    }
  })
  return workshops
}

type WorkshopWithAttendeeCount = Awaited<ReturnType<typeof getWorkshopList>>

export const registerBeneficiaries = createMutation({
  inputValidation: registerBeneficiariesSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.registerBeneficiaries',
    target: 'Workshop',
    targetId: ({ input }) => input.workshopIds.join(', '),
    action: UserActivityType.UPDATE
  }
})
