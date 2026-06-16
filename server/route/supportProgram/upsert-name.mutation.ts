import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { SupportProgramNameRepo } from '~/server/database'
import {
  upsertSupportProgramNameSchema,
  type UpsertSupportProgramNameInput
} from '~/server/schema'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

const handler = ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: UpsertSupportProgramNameInput
}) => {
  if (input.id) {
    return SupportProgramNameRepo.update(ctx.user, {
      where: { id: input.id, structureId: ctx.structure.id },
      data: { name: input.name },
      select: { id: true, name: true }
    })
  }

  return SupportProgramNameRepo.create(ctx.user, {
    data: {
      name: input.name,
      structure: { connect: { id: ctx.structure.id } },
      createdBy: { connect: { id: ctx.user.id } }
    },
    select: { id: true, name: true }
  })
}

export const upsertNameMutation = createMutation({
  inputValidation: upsertSupportProgramNameSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'supportProgramName.upsert',
    target: UserActivityObject.SupportProgramName,
    targetId: ({ routeResult }) => routeResult.id,
    action: UserActivityType.UPDATE
  }
})
