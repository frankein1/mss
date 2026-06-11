import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { RdvspService } from '~/server/services'

const securityCheck = (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.rdv.access
}

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return RdvspService.getAuthStatus({ ctx })
}

export default createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck
})
