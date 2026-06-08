import { UserActivityType, WorkshopAttendeeType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { DuplicateWorkshopInput } from '~/server/schema'
import { duplicateWorkshopSchema } from '~/server/schema'
import {
  WorkshopRepo,
  PartnerOrganizationRepo,
  WorkshopAttendeeRepo
} from '~/server/database'
import {
  getAppContextPermissions,
  type SecurityRuleContext
} from '~/server/security'
import { prismaClient } from '~/server/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: DuplicateWorkshopInput
) => {
  if (
    input.duplicateParticipants &&
    !getAppContextPermissions(ctx).workshop.duplicateParticipants
  ) {
    return false
  }
  try {
    await WorkshopRepo.findUniqueOrThrow(ctx.user, {
      select: { id: true },
      where: { id: input.sourceWorkshopId }
    })
    if (input.partnerOrganizationId) {
      await PartnerOrganizationRepo.findUniqueOrThrow(ctx.user, {
        where: { id: input.partnerOrganizationId },
        select: { id: true }
      })
    }
  } catch {
    return false
  }
  return true
}

const handler = async ({
  input: {
    partnerOrganizationId,
    name,
    sourceWorkshopId,
    duplicateParticipants,
    ...workshopInput
  },
  ctx
}: {
  input: DuplicateWorkshopInput
  ctx: ProtectedAppContext
}) => {
  const canDuplicateParticipants =
    duplicateParticipants &&
    getAppContextPermissions(ctx).workshop.duplicateParticipants

  const sourceAttendees = canDuplicateParticipants
    ? await WorkshopAttendeeRepo.findMany(ctx.user, {
        where: { workshopId: sourceWorkshopId },
        select: {
          type: true,
          beneficiaryId: true,
          listType: true,
          comment: true,
          paymentReceived: true,
          paymentAmount: true,
          workshopExternalAttendee: {
            select: {
              firstName: true,
              lastName: true,
              gender: true,
              birthDate: true,
              email: true,
              phone: true,
              city: true,
              isAnonymized: true
            }
          }
        }
      })
    : []

  return prismaClient.$transaction(async () => {
    const newWorkshop = await WorkshopRepo.create(ctx.user, {
      select: { id: true },
      data: {
        ...workshopInput,
        partnerOrganization: partnerOrganizationId
          ? { connect: { id: partnerOrganizationId } }
          : {},
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
        },
        createdBy: { connect: { id: ctx.user.id } },
        structure: { connect: { id: ctx.structure.id } }
      }
    })

    if (!canDuplicateParticipants || sourceAttendees.length === 0) {
      return newWorkshop
    }

    const beneficiariesToDuplicate = sourceAttendees.filter(
      a => a.type === WorkshopAttendeeType.Beneficiary
    )

    if (beneficiariesToDuplicate.length > 0) {
      await prismaClient.workshopAttendee.createMany({
        data: beneficiariesToDuplicate.map(beneficiary => ({
          workshopId: newWorkshop.id,
          type: WorkshopAttendeeType.Beneficiary,
          listType: beneficiary.listType,
          beneficiaryId: beneficiary.beneficiaryId,
          comment: beneficiary.comment,
          paymentReceived: beneficiary.paymentReceived,
          paymentAmount: beneficiary.paymentAmount
        }))
      })
    }

    const externalAttendees = sourceAttendees.filter(
      a =>
        a.type === WorkshopAttendeeType.External &&
        a.workshopExternalAttendee &&
        !a.workshopExternalAttendee.isAnonymized
    )

    for (const attendee of externalAttendees) {
      const ext = attendee.workshopExternalAttendee!
      await prismaClient.workshopAttendee.create({
        data: {
          workshop: { connect: { id: newWorkshop.id } },
          type: WorkshopAttendeeType.External,
          listType: attendee.listType,
          comment: attendee.comment,
          paymentReceived: attendee.paymentReceived,
          paymentAmount: attendee.paymentAmount,
          workshopExternalAttendee: {
            create: {
              firstName: ext.firstName,
              lastName: ext.lastName,
              gender: ext.gender,
              birthDate: ext.birthDate,
              email: ext.email,
              phone: ext.phone,
              city: ext.city
            }
          }
        }
      })
    }

    return newWorkshop
  })
}

export const duplicateWorkshop = createMutation({
  inputValidation: duplicateWorkshopSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.duplicateWorkshop',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
