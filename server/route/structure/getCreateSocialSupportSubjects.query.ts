import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureService } from '~/server/services'

export const getCreateSocialSupportSubjects = createQuery({
  handler: async ({ ctx }) => {
    return await StructureService.getCreateSocialSupportSubjects({
      ctx
    })
  },
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
