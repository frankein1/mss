import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FamilyFileService } from '~/server/services'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  FamilyFileService.getCreationPermissions(ctx)

export const getBeneficiaryCreationPermissionsQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
