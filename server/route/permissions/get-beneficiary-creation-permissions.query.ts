import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getBeneficiaryPermissions } from '~/server/security'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return Promise.resolve(
    getBeneficiaryPermissions({
      ctx
    })
  )
}

export const getBeneficiaryCreationPermissionsQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
