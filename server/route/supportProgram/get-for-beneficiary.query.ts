import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { BeneficiaryRepo } from '~/server/database'
import { beneficiaryIdSchema, type BeneficiaryIdInput } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: BeneficiaryIdInput
}) => {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: {
      supportPrograms: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          supportProgramName: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  return beneficiary.supportPrograms
}

export const getSupportProgramsForBeneficiaryQuery = createQuery({
  inputValidation: beneficiaryIdSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
