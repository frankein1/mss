import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { AdminService } from '~~/server/services'
import type { AdminContext } from '~~/server/trpc'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: IdInput
}) => {
  const config = useRuntimeConfig()
  const structureDisabled = await AdminService.disableStructure({
    config,
    id: input.id,
    disabledById: ctx.user.id
  })
  return {
    name: structureDisabled.name,
    id: structureDisabled.id,
    disabled: true
  }
}

export const disableStructure = createMutation({
  inputValidation: idSchema,
  adminHandler,
  auditLog: {
    key: 'admin.structure.disable',
    target: 'Structure',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.ARCHIVE
  }
})
