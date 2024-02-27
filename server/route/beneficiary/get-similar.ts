import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  GetSimilarBeneficiariesInput,
  getSimilarBeneficiariesSchema
} from '~/server/schema'
import { BeneficiaryService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = ({
  input,
  ctx
}: {
  input: GetSimilarBeneficiariesInput
  ctx: ProtectedAppContext
}) => BeneficiaryService.getSimilar({ ctx, input })

export const getSimilarBeneficiariesQuery = createQuery({
  inputValidation: getSimilarBeneficiariesSchema,
  securityCheck: AllowSecurityCheck,
  handler
})

export type SimilarBeneficiaries = Prisma.PromiseReturnType<typeof handler>
