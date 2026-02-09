import { createQuery } from '~/server/route'
import type { GetFollowupsInput } from '~/server/schema'
import { getFollowupsSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FollowupService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: GetFollowupsInput
  ctx: ProtectedAppContext
}) => {
  return await FollowupService.getPage({ input, ctx })
}

export const getPage = createQuery({
  inputValidation: getFollowupsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})

type FollowupPage = Awaited<ReturnType<typeof handler>>
export type FollowupPageItems = FollowupPage['items']
export type FollowupPageItem = FollowupPageItems[0]
