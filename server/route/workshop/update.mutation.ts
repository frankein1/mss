import type { Prisma } from '@prisma/client'
import { UserActivityType, WorkshopAttendeeListType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { UpdateWorkShopInput } from '~~/server/schema'
import { updateWorkshopSchema } from '~~/server/schema'
import {
  WorkshopRepo,
  WorkshopNameRepo,
  PartnerOrganizationRepo,
  SupportProgramNameRepo,
  WorkshopAttendeeRepo
} from '~~/server/database'
import {
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~~/server/security'
import { UpdateWorkshopNameMode } from '~/utils/constants/workshop'
import { getOne } from './get.query'
import { TRPCError } from '@trpc/server'
import { MSS_ERROR_CODES } from '~/utils/error'
import { prismaClient } from '~~/server/prisma/prismaClient'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateWorkShopInput
) => {
  const { user } = ctx
  const { partnerOrganizationId: pid, supportProgramNameId: sid } = input
  const [pfound, sfound] = await Promise.all([
    !pid ||
      validateOneBelongsToStructure(
        user,
        pid,
        PartnerOrganizationRepo.findUniqueOrThrow
      ),
    !sid ||
      validateOneBelongsToStructure(
        user,
        sid,
        SupportProgramNameRepo.findUniqueOrThrow
      )
  ])

  return pfound && sfound
}

const handler = async ({
  input: {
    partnerOrganizationId,
    supportProgramNameId,
    mode,
    name,
    id,
    ...input
  },
  ctx
}: {
  input: UpdateWorkShopInput
  ctx: ProtectedAppContext
}) => {
  const workshop = await getOne(ctx.user, id)
  if (
    input.attendeeLimit !== null &&
    input.attendeeLimit !== undefined &&
    input.attendeeLimit < workshop._count.mainAttendees
  ) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Workshop ${id} already has ${workshop._count.mainAttendees}. Can not reduce the attendeeLimit to: ${input.attendeeLimit}`,
      cause: {
        MSS_CODE: MSS_ERROR_CODES.WORKSHOP_MIN_ATTENDEE_LIMIT
      }
    })
  }
  if (input.attendeeLimit === null && workshop.attendeeLimit !== null) {
    await WorkshopAttendeeRepo.updateMany(ctx.user, {
      data: {
        listType: WorkshopAttendeeListType.Main
      },
      where: { workshopId: id }
    })
  }
  if (mode && name) {
    await updateWorkshopName(ctx, { mode, name, id })
  }

  const updateWorkshopTransaction = () =>
    WorkshopRepo.update(ctx.user, {
      select: { id: true },
      where: { id },
      data: {
        ...input,
        partnerOrganization: partnerOrganizationId
          ? { connect: { id: partnerOrganizationId } }
          : { disconnect: true },
        supportProgramName: supportProgramNameId
          ? { connect: { id: supportProgramNameId } }
          : { disconnect: true }
      }
    })

  const transactions: (() => Prisma.PrismaPromise<any>)[] = [
    updateWorkshopTransaction
  ]

  // In case of a change from chargeable to not chargeable
  if (workshop.chargeable === true && input.chargeable === false) {
    transactions.push(() =>
      WorkshopAttendeeRepo.updateMany(ctx.user, {
        where: { workshopId: id },
        data: {
          paymentReceived: null,
          paymentAmount: null
        }
      })
    )
  }

  const [wks, _attendeeCount] = await prismaClient.$transaction(
    transactions.map(t => t())
  )

  return wks
}

async function updateWorkshopName(
  ctx: ProtectedAppContext,
  input: Required<Pick<UpdateWorkShopInput, 'mode' | 'name' | 'id'>>
) {
  const { workshopName: currentWorkshopName } =
    await WorkshopRepo.findUniqueOrThrow(ctx.user, {
      select: {
        workshopName: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: { id: input.id }
    })

  if (currentWorkshopName.name === input.name) {
    return { case: 'no-change', value: undefined }
  }

  if (input.mode === UpdateWorkshopNameMode.current) {
    const nWorkshopsWithSameName = await WorkshopRepo.count(ctx.user, {
      where: {
        workshopNameId: currentWorkshopName.id,
        structureId: ctx.structure.id
      }
    })

    // if more than 1 workshop with this name exist, the workshop name is kept
    if (nWorkshopsWithSameName > 1) {
      const value = await updateNameForCurrentWorkshop(
        ctx,
        input.id,
        input.name
      )
      return { case: 'update-current', value }
    }

    // else the orphan workshop name is deleted
    const [_, value] = await prismaClient.$transaction([
      updateNameForCurrentWorkshop(ctx, input.id, input.name),
      WorkshopNameRepo.delete(ctx.user, {
        where: { id: currentWorkshopName.id, structureId: ctx.structure.id }
      })
    ])

    return { case: 'update-current-and-delete-previous-name', value }
  }

  const targetWorkshopName = await WorkshopNameRepo.findUnique(ctx.user, {
    select: { id: true },
    where: {
      structureId_name: { structureId: ctx.structure.id, name: input.name }
    }
  })

  if (targetWorkshopName === null) {
    // update workshop name to a new value for all workshops sharing same name'
    const value = await updateNameForAllWorkshops(
      ctx,
      currentWorkshopName.id,
      input.name
    )
    return { case: 'update-all-to-new', value }
  }

  // unlink all workshops from current name and connect then to another existing workshop name'
  const value = await linkWorkshopsToExistingWorkshopName(
    ctx,
    currentWorkshopName.id,
    targetWorkshopName.id
  )
  return { case: 'update-all-to-existing', value }
}

/**
 * Only the identified workshop is modified and linked to another workshop name.
 * If the worskhop name does not exist it is created, otherwise the
 * workshop is connected to the target existing workshop name
 */
function updateNameForCurrentWorkshop(
  ctx: ProtectedAppContext,
  id: string,
  name: string
) {
  return WorkshopRepo.update(ctx.user, {
    select: { id: true },
    where: {
      id,
      structureId: ctx.structure.id
    },
    data: {
      workshopName: {
        connectOrCreate: {
          where: {
            structureId_name: {
              name,
              structureId: ctx.structure.id
            }
          },
          create: {
            name,
            structureId: ctx.structure.id,
            createdById: ctx.user.id
          }
        }
      }
    }
  })
}

async function updateNameForAllWorkshops(
  ctx: ProtectedAppContext,
  currentWorkshopNameId: string,
  name: string
) {
  return await WorkshopNameRepo.update(ctx.user, {
    select: { id: true },
    data: { name },
    where: { id: currentWorkshopNameId }
  })
}

/** All workshops with same workshop name as `workshopId` are connected
 * to the existing workshop name `name`.
 * Then the orphan workshop name is deleted
 */
async function linkWorkshopsToExistingWorkshopName(
  ctx: ProtectedAppContext,
  previousWorkshopNameId: string,
  targetWorkshopNameId: string
) {
  const workshopsWithSameName = await WorkshopRepo.findMany(ctx.user, {
    select: { id: true },
    where: { workshopNameId: previousWorkshopNameId }
  })

  const targetWorkshopName = await prismaClient?.$transaction([
    WorkshopRepo.updateMany(ctx.user, {
      where: { id: { in: workshopsWithSameName.map(w => w.id) } },
      data: {
        workshopNameId: targetWorkshopNameId
      }
    }),
    WorkshopNameRepo.delete(ctx.user, {
      where: { id: previousWorkshopNameId }
    })
  ])

  return targetWorkshopName
}

export const updateWorkshop = createMutation({
  inputValidation: updateWorkshopSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.updateWorkshop',
    target: 'Workshop',
    targetId: ({ input }) => input.id,
    action: UserActivityType.UPDATE
  }
})
