import { z } from 'zod'
import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { BeneficiaryRepo } from '~/server/database'

const inputValidation = z.object({
  beneficiaryId: z.string().uuid().or(z.literal(''))
})

type Input = z.infer<typeof inputValidation>

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: Input
}) => {
  if (!input.beneficiaryId) {
    return []
  }
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: {
      devices: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          deviceName: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })
  return beneficiary.devices
}

export const getDevicesForBeneficiaryQuery = createQuery({
  inputValidation,
  securityCheck: async (ctx, input) => {
    // BeneficiaryRepo.findUniqueOrThrow already enforces structure scoping via constraints
    return true
  },
  handler
})
