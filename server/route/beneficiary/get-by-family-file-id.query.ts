import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  GetByFamilyFileIdInput,
  getByFamilyFileIdSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: GetByFamilyFileIdInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.getByFamileFileId({ ctx, input })
}

export default createQuery({
  inputValidation: getByFamilyFileIdSchema,
  securityCheck,
  handler
})
