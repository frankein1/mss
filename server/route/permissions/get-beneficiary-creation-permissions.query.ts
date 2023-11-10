import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getBeneficiaryEditPermissions } from '~/server/security'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return Promise.resolve(
    getBeneficiaryEditPermissions({
      user: ctx.user,
      structure: ctx.structure
    })
  )
}

export const getBeneficiaryCreationPermissionsQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
