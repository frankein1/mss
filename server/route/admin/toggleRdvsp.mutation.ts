import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { ToggleRdvspInput } from '~/server/schema'
import { toggleRdvspSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { StructureRepo } from '~/server/database'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: ToggleRdvspInput
}) =>
  await StructureRepo.prisma.update({
    where: { id: input.id },
    data: { externalRdvspActive: input.externalRdvspActive }
  })

export const toggleRdvsp = createMutation({
  inputValidation: toggleRdvspSchema,
  adminHandler,
  auditLog: {
    key: 'admin.toggleRdvsp',
    // FIXME fix rdvsp
    target: UserActivityObject.Beneficiary,
    targetId: tg => tg.input.id,
    action: UserActivityType.CREATE
  }
})
