import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { GetHelpRequestsInput, getHelpRequestsSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { HelpRequestService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: GetHelpRequestsInput
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.getPage({ ctx, input })
}

export const getPage = createQuery({
  inputValidation: getHelpRequestsSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
