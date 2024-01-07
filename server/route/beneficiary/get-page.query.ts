import { createQuery } from '~/server/route'
import { GetBeneficiariesInput, getBeneficiariesSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: GetBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.getPage({ ctx, input })
}

export const getPage = createQuery({
  inputValidation: getBeneficiariesSchema,
  securityCheck,
  handler
})
