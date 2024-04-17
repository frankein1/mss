import { createMutation } from '../createRoute'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { UserService } from '~/server/services'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return await UserService.acceptCGU({ ctx })
}

export const acceptCGUMutation = createMutation({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
