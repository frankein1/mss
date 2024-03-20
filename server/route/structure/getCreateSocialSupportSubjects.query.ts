import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { SocialSupportSubjectService } from '~/server/services'

export const getCreateSocialSupportSubjects = createQuery({
  handler: async ({ ctx }) => {
    return await SocialSupportSubjectService.getCreateSocialSupportSubjects({
      ctx
    })
  },
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
