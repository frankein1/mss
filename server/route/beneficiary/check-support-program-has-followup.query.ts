import { z } from 'zod'
import { createQuery } from '~/server/route'
import { FollowupRepo } from '~/server/database'
import type { ProtectedAppContext } from '~/server/trpc'

const inputValidation = z.object({
  supportProgramId: z.string().uuid()
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
    where: { supportProgramId: input.supportProgramId }
  })
  return count > 0
}

export const checkSupportProgramHasFollowupQuery = createQuery({
  inputValidation,
  securityCheck: async () => true,
  handler
})
