import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import { AdminService } from '~~/server/services'
import type { AdminContext } from '~~/server/trpc'

/** First step of the deactivation of a still active structure: send a single use
 * code to the administrator's email address. The code is then passed to
 * `disableStructure` to confirm.
 */
const adminHandler = ({
  ctx,
  input
}: {
  ctx: AdminContext
  input: IdInput
}) => {
  return AdminService.sendDisableStructureCode({ ctx, id: input.id })
}

export const authorizeDisableStructure = createMutation({
  inputValidation: idSchema,
  adminHandler,
  auditLog: {
    key: 'admin.structure.authorize-disable',
    target: 'Structure',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
