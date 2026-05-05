import { z } from 'zod'
import { createQuery } from '~/server/route'
import { FollowupRepo } from '~/server/database'
import type { ProtectedAppContext } from '~/server/trpc'

const inputValidation = z.object({
  deviceId: z.string().uuid()
})

type Input = z.infer<typeof inputValidation>

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: Input
}) => {
  const count = await FollowupRepo.count(ctx.user, {
    where: { beneficiaryDeviceId: input.deviceId }
  })
  return count > 0
}

export const checkDeviceHasFollowupQuery = createQuery({
  inputValidation,
  securityCheck: async () => true,
  handler
})
