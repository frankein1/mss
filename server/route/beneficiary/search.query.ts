import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SearchBeneficiaryInput,
  searchBeneficiarySchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

const securityCheck = AllowSecurityCheck

const handler = ({
  input,
  ctx
}: {
  input: SearchBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  return BeneficiaryService.search({ ctx, input })
}

export const searchBeneficiaryQuery = createQuery({
  inputValidation: searchBeneficiarySchema,
  securityCheck,
  handler
})
