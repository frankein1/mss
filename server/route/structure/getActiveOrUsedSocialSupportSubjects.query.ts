import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { emptySchema } from '~~/server/schema'
import { StructureService } from '~~/server/services'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return await StructureService.getActiveOrUsedSocialSupportSubjects({ ctx })
}

export const getActiveOrUsedSocialSupportSubjects = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
