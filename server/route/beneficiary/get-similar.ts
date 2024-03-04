import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  GetSimilarBeneficiaryInput,
  getSimilarBeneficiarySchema
} from '~/server/schema'
import { BeneficiaryService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = ({
  input,
  ctx
}: {
  input: GetSimilarBeneficiaryInput
  ctx: ProtectedAppContext
}) => BeneficiaryService.getSimilar({ ctx, input })

export const getSimilarBeneficiaryQuery = createQuery({
  inputValidation: getSimilarBeneficiarySchema,
  securityCheck: AllowSecurityCheck,
  handler
})

export type SimilarBeneficiary = Prisma.PromiseReturnType<typeof handler>
