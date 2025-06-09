import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getIntegrationContextPermissions } from '~/server/security'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  getIntegrationContextPermissions(ctx)

export const getIntegrationsPermissions = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
