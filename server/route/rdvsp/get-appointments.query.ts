import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { RdvspService } from '~/server/services'
import {
  type SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

const securityCheck = (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.module.rdv
}

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  RdvspService.getAppointments({ ctx })

export const getAppointments = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
