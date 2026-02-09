import { UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FamilyFileService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return await FamilyFileService.split({ input, ctx })
}

export const split = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'file.split',
    target: 'FamilyFile',
    targetId: ({ input: { id } }) => {
      return id
    },
    action: UserActivityType.CREATE
  }
})
