import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  UpdateWorkshopNameInput,
  updateWorkshopNameSchema
} from '~/server/schema/workshop/updateWorkshopName.schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopNameRepo } from '~/server/database/repository/WorkshopNameRepository'

const securityCheck = AllowSecurityCheck

const handler = ({
  input: { id, name },
  ctx
}: {
  input: UpdateWorkshopNameInput
  ctx: ProtectedAppContext
}) =>
  WorkshopNameRepo.update(ctx.user, {
    data: { name },
    where: { id }
  })

export const updateWorkshopName = createMutation({
  inputValidation: updateWorkshopNameSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'workshop.updateWorkshopName',
    target: 'WorkshopName',
    targetId: ({ input }) => input.id,
    action: UserActivityType.UPDATE
  }
})
