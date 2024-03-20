import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { SocialSupportSubjectRepo, StructureRepo } from '~/server/database'

const handler = async ({
  ctx: {
    structure: { id },
    user
  }
}: {
  ctx: ProtectedAppContext
}) => {
  const structure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id }
  })

  const socialSupportSubjects = await SocialSupportSubjectRepo.findMany(user, {
    orderBy: {
      name: 'asc'
    }
  })

  return {
    structure,
    socialSupportSubjects
  }
}

export const getStructure = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
