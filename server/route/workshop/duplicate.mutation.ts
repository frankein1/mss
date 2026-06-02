import {
  UserActivityType,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { DuplicateWorkshopInput } from '~/server/schema'
import { duplicateWorkshopSchema } from '~/server/schema'
import {
  WorkshopRepo,
  PartnerOrganizationRepo,
  WorkshopAttendeeRepo
} from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'
import { prismaClient } from '~/server/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: DuplicateWorkshopInput
) => {
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
  const sourceAttendees = duplicateParticipants
    ? await WorkshopAttendeeRepo.findMany(ctx.user, {
        where: { workshopId: sourceWorkshopId },
        select: {
          type: true,
          beneficiaryId: true,
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

    if (!duplicateParticipants || sourceAttendees.length === 0) {
      return newWorkshop
    }

    const beneficiaryIds = sourceAttendees
      .filter(
        a => a.type === WorkshopAttendeeType.Beneficiary && a.beneficiaryId
      )
      .map(a => a.beneficiaryId!)

    if (beneficiaryIds.length > 0) {
      await prismaClient.workshopAttendee.createMany({
        data: beneficiaryIds.map(beneficiaryId => ({
          workshopId: newWorkshop.id,
          type: WorkshopAttendeeType.Beneficiary,
          listType: WorkshopAttendeeListType.Main,
          beneficiaryId
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
          listType: WorkshopAttendeeListType.Main,
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
