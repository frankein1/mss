import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateWorkShopInput } from '~/server/schema'
import { updateWorkshopSchema } from '~/server/schema'
import {
  WorkshopRepo,
  WorkshopNameRepo,
  PartnerOrganizationRepo
} from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'
import { UpdateWorkshopNameMode } from '~/utils/constants/workshop'
import { getOne } from './get.query'
import { TRPCError } from '@trpc/server'
import { MSS_ERROR_CODES } from '~/utils/error'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateWorkShopInput
) => {
  if (!input.partnerOrganizationId) {
    return true
  }
  try {
    await PartnerOrganizationRepo.findUniqueOrThrow(ctx.user, {
      where: { id: input.partnerOrganizationId },
      select: { id: true }
    })
  } catch {
    return false
  }
  return true
}

const handler = async ({
  input: { partnerOrganizationId, mode, name, id, ...input },
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
  if (mode && name) {
    await updateWorkshopName(ctx, { mode, name, id })
  }

  return await WorkshopRepo.update(ctx.user, {
    select: { id: true },
    where: { id },
    data: {
      ...input,
      partnerOrganization: partnerOrganizationId
        ? { connect: { id: partnerOrganizationId } }
        : { disconnect: true }
    }
  })
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
    const value = await updateNameForCurrentWorkshop(ctx, input.id, input.name)
    return { case: 'update-current', value }
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
async function updateNameForCurrentWorkshop(
  ctx: ProtectedAppContext,
  id: string,
  name: string
) {
  return await WorkshopRepo.update(ctx.user, {
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
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.UPDATE
  }
})
