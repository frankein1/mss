import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { GetSocialSupportSubjectInput } from '~~/server/schema'
import { getSocialSupportSubjectSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SocialSupportSubjectRepo } from '~~/server/database'

const handler = async ({
  ctx: { user, structure },
  input
}: {
  ctx: ProtectedAppContext
  input: GetSocialSupportSubjectInput
}) => {
  const subjects = await SocialSupportSubjectRepo.findMany(user, {
    where: {
      name: { equals: input.name, mode: 'insensitive' },
      ownedByStructureId: structure.id
    }
  })
  return subjects.length > 0 ? subjects[0] : null
}

export const findSocialSupportSubject = createQuery({
  handler,
  inputValidation: getSocialSupportSubjectSchema,
  securityCheck: AllowSecurityCheck
})
