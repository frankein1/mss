import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { SocialSupportSubjectRepo } from '~/server/database'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await SocialSupportSubjectRepo.findMany(user, {
    where: {
      inactive: false
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getActiveSocialSupportSubjects = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
