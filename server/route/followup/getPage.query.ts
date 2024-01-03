import { createQuery } from '~/server/route'
import { GetFollowupsInput, getFollowupsSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FollowupService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: GetFollowupsInput
  ctx: ProtectedAppContext
}) => {
  return await FollowupService.page({ input, ctx })
}

export const getPage = createQuery({
  inputValidation: getFollowupsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
