import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ToggleRdvspInput } from '~~/server/schema'
import { toggleRdvspSchema } from '~~/server/schema'
import type { AdminContext } from '~~/server/trpc'
import { StructureRepo } from '~~/server/database'
import { sendStructureEvent } from '~~/server/integrations/brevo/service'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: ToggleRdvspInput
}) => {
  const res = await StructureRepo.prisma.update({
    select: { externalRdvspActive: true },
    where: { id: input.id },
    data: { externalRdvspActive: input.externalRdvspActive }
  })

  if (input.externalRdvspActive) {
    sendStructureEvent({
      name: 'enable_rdvsp_integration',
      id: input.id
    }).catch(error => console.error(error))
  }

  return res
}

export const toggleRdvsp = createMutation({
  inputValidation: toggleRdvspSchema,
  adminHandler,
  auditLog: {
    key: 'admin.toggleRdvsp',
    target: UserActivityObject.Structure,
    targetId: tg => tg.input.id,
    action: UserActivityType.UPDATE
  }
})
