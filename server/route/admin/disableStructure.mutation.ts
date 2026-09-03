import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { DisableStructureInput } from '~~/server/schema'
import { disableStructureSchema } from '~~/server/schema'
import { AdminService, UserService } from '~~/server/services'
import type { AdminContext } from '~~/server/trpc'

const adminHandler = async ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: DisableStructureInput
}) => {
  // A still active structure can only be disabled with the code sent by
  // `authorizeDisableStructure`, which lifts the inactivity check in the service.
  if (input.code) {
    await UserService.verifyAuthorizationCode({
      ctx,
      input: { code: input.code }
    })
  }

  const config = useRuntimeConfig()
  const structureDisabled = await AdminService.disableStructure({
    config,
    id: input.id,
    disabledById: ctx.user.id,
    confirmedByCode: !!input.code
  })
  return {
    name: structureDisabled.name,
    id: structureDisabled.id,
    disabled: true
  }
}

export const disableStructure = createMutation({
  inputValidation: disableStructureSchema,
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
