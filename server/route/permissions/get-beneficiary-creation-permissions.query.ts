import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getFamilyFilePermissions } from '~/server/security'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) => {
  return Promise.resolve(
    getFamilyFilePermissions({
      ctx
    })
  )
}

export const getBeneficiaryCreationPermissionsQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
