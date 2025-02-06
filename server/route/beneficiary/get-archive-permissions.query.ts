import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { id },
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  return await BeneficiaryService.getArchivePermissions({
    ctx,
    id
  })
}

export const getBeneficiaryArchivePermissionsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
