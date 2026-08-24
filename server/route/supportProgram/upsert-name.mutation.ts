import { UserActivityObject, UserActivityType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createMutation } from '~~/server/route'
import { invalidError, type ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { SupportProgramNameRepo } from '~~/server/database'
import {
  upsertSupportProgramNameSchema,
  type UpsertSupportProgramNameInput
} from '~~/server/schema'
import { SupportProgramService } from '~~/server/services'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

async function throwBadRequestForLifecycleDeactivation(
  ctx: ProtectedAppContext,
  supportProgramNameId: string
) {
  const existings = await SupportProgramNameRepo.findMany(ctx.user, {
    where: { id: supportProgramNameId },
    select: { hasLifecycle: true }
  })

  if (existings[0] && existings[0].hasLifecycle) {
    const nameUsage = await SupportProgramService.countSupportProgramNameUsage({
      ctx,
      supportProgramNameId
    })

    if (nameUsage && nameUsage > 0) {
      throw invalidError(
        'Cannot switch from lifecycle to non-lifecycle while the name is in use for beneficiaries or workshops'
      )
    }
  }
}

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: UpsertSupportProgramNameInput
}) => {
  if (input.id) {
    if (!input.hasLifecycle) {
      await throwBadRequestForLifecycleDeactivation(ctx, input.id)
    }

    return SupportProgramNameRepo.update(ctx.user, {
      where: { id: input.id, structureId: ctx.structure.id },
      data: { name: input.name, hasLifecycle: input.hasLifecycle },
      select: { id: true, name: true, hasLifecycle: true }
    })
  }

  return SupportProgramNameRepo.create(ctx.user, {
    data: {
      name: input.name,
      hasLifecycle: input.hasLifecycle,
      structure: { connect: { id: ctx.structure.id } },
      createdBy: { connect: { id: ctx.user.id } }
    },
    select: { id: true, name: true, hasLifecycle: true }
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
