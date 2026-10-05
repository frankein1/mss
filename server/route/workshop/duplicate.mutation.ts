import { UserActivityType, WorkshopAttendeeType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { DuplicateWorkshopInput } from '~~/server/schema'
import { duplicateWorkshopSchema } from '~~/server/schema'
import {
  WorkshopRepo,
  PartnerOrganizationRepo,
  SupportProgramNameRepo,
  WorkshopAttendeeRepo
} from '~~/server/database'
import {
  getAppContextPermissions,
  validateOneBelongsToStructure,
  type SecurityRuleContext
} from '~~/server/security'
import { prismaClient } from '~~/server/prisma'
import { TRPCError } from '@trpc/server'

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
  const { user } = ctx
  const { partnerOrganizationId: pid, supportProgramNameId: sid } = input
  const [wfound, pfound, sfound] = await Promise.all([
    validateOneBelongsToStructure(
      user,
      input.sourceWorkshopId,
      WorkshopRepo.findUniqueOrThrow
    ),
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

  return wfound && pfound && sfound
}

const handler = async ({
  input: {
    partnerOrganizationId,
    supportProgramNameId,
    name,
    sourceWorkshopId,
    duplicateParticipants,
    attendeeLimit,
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

  const initialWorkshop = await WorkshopRepo.findUniqueOrThrow(ctx.user, {
    where: {
      id: sourceWorkshopId
    },
    select: {
      id: true,
      attendeeLimit: true
    }
  })

  // duplication with participants cannot change attendeeMimit
  if (duplicateParticipants && initialWorkshop.attendeeLimit != attendeeLimit) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Can not change the attendee limit'
    })
  }

  const sourceAttendees = canDuplicateParticipants
    ? await WorkshopAttendeeRepo.findMany(ctx.user, {
        where: { workshopId: sourceWorkshopId },
        // Deterministic order so the copied attendees preserve the source
        // arrival order; matches the detail-list ordering.
        orderBy: [{ created: 'asc' }, { id: 'asc' }],
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

  return prismaClient.$transaction(async tx => {
    const newWorkshop = await tx.workshop.create({
      select: { id: true },
      data: {
        ...workshopInput,
        attendeeLimit,
        partnerOrganization: partnerOrganizationId
          ? { connect: { id: partnerOrganizationId } }
          : undefined,
        supportProgramName: supportProgramNameId
          ? { connect: { id: supportProgramNameId } }
          : undefined,
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

    // All rows inserted in one transaction would otherwise share the same
    // `created` (now() = transaction start), making the attendee order
    // undefined. Stagger `created` by 1ms per row (the TIMESTAMP(3) resolution)
    // so the copied list keeps a stable, meaningful order.
    const duplicationBase = Date.now()
    const staggeredCreated = (index: number) =>
      new Date(duplicationBase + index)

    // Tag each attendee with its position in the sorted source list, so both
    // insert passes stamp `created` by global order. This keeps beneficiaries
    // and externals interleaved exactly as in the source instead of grouping
    // all beneficiaries ahead of all externals.
    const orderedAttendees = sourceAttendees.map(
      (attendee, sourceOrderIndex) => ({
        attendee,
        sourceOrderIndex
      })
    )

    const beneficiariesToDuplicate = orderedAttendees.filter(
      ({ attendee }) => attendee.type === WorkshopAttendeeType.Beneficiary
    )

    if (beneficiariesToDuplicate.length > 0) {
      await tx.workshopAttendee.createMany({
        data: beneficiariesToDuplicate.map(
          ({ attendee, sourceOrderIndex }) => ({
            workshopId: newWorkshop.id,
            type: WorkshopAttendeeType.Beneficiary,
            listType: attendee.listType,
            beneficiaryId: attendee.beneficiaryId,
            comment: attendee.comment,
            paymentReceived: attendee.paymentReceived,
            paymentAmount: attendee.paymentAmount,
            created: staggeredCreated(sourceOrderIndex)
          })
        )
      })
    }

    const externalAttendees = orderedAttendees.filter(
      ({ attendee }) =>
        attendee.type === WorkshopAttendeeType.External &&
        attendee.workshopExternalAttendee &&
        !attendee.workshopExternalAttendee.isAnonymized
    )

    if (externalAttendees.length > 0) {
      const createdExternals =
        await tx.workshopExternalAttendee.createManyAndReturn({
          data: externalAttendees.map(({ attendee }) => {
            const ext = attendee.workshopExternalAttendee!
            return {
              firstName: ext.firstName,
              lastName: ext.lastName,
              gender: ext.gender,
              birthDate: ext.birthDate,
              email: ext.email,
              phone: ext.phone,
              city: ext.city
            }
          })
        })

      await tx.workshopAttendee.createMany({
        data: externalAttendees.map(({ attendee, sourceOrderIndex }, i) => ({
          workshopId: newWorkshop.id,
          type: WorkshopAttendeeType.External,
          listType: attendee.listType,
          comment: attendee.comment,
          paymentReceived: attendee.paymentReceived,
          paymentAmount: attendee.paymentAmount,
          workshopExternalAttendeeId: createdExternals[i]?.id,
          created: staggeredCreated(sourceOrderIndex)
        }))
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
