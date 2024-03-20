import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  GetSocialSupportSubjectInput,
  getSocialSupportSubjectSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { SocialSupportSubjectService } from '~/server/services'

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: GetSocialSupportSubjectInput
}) => {
  return await SocialSupportSubjectService.get({ input, ctx })
}

export const getSocialSupportSubject = createQuery({
  handler,
  inputValidation: getSocialSupportSubjectSchema,
  securityCheck: AllowSecurityCheck
})
