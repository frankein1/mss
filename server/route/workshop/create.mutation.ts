import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { CreateWorkshopInput, createWorkshopSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopRepo } from '~/server/database'

// FIXME: Requires additional checks?
const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: CreateWorkshopInput
  ctx: ProtectedAppContext
}) =>
  WorkshopRepo.prisma.create({
    select: { id: true },
    data: {
      ...input,
      structureId: ctx.structure.id
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
