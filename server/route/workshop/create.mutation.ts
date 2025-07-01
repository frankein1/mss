import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { CreateWorkshopInput, createWorkshopSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopRepo } from '~/server/database'

// FIXME: Requires additional checks?
const securityCheck = AllowSecurityCheck

const handler = ({
  input: { partnerOrganizationId, name, ...input },
  ctx
}: {
  input: CreateWorkshopInput
  ctx: ProtectedAppContext
}) =>
  WorkshopRepo.prisma.create({
    select: { id: true },
    data: {
      ...input,
      partnerOrganization: { connect: { id: partnerOrganizationId } },
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
