import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { RdvspService } from '~/server/services'
import {
  getIntegrationContextPermissions,
  type SecurityRuleContext
} from '~/server/security'

const securityCheck = async (ctx: SecurityRuleContext) => {
  const integrations = await getIntegrationContextPermissions(ctx)
  return integrations.rdv
}

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  RdvspService.getAppointments({ ctx })

export const getAppointments = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
