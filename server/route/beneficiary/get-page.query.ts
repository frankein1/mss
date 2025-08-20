import { createQuery } from '~/server/route'
import type { GetBeneficiariesInput } from '~/server/schema'
import { getBeneficiariesSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
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
