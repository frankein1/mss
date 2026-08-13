import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { CreateWorkshopInput } from '~~/server/schema'
import { createWorkshopSchema } from '~~/server/schema'
import { WorkshopRepo, PartnerOrganizationRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateWorkshopInput
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

const handler = ({
  input: { partnerOrganizationId, name, ...input },
  ctx
}: {
  input: CreateWorkshopInput
  ctx: ProtectedAppContext
}) =>
  WorkshopRepo.create(ctx.user, {
    select: { id: true },
    data: {
      ...input,
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

export const createWorkshop = createMutation({
  inputValidation: createWorkshopSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.createWorkshop',
    target: 'Workshop',
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.CREATE
  }
})
