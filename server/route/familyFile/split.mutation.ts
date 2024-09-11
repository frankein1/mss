import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { IdInput, idSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
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
