import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureRepo } from '~/server/database'

const handler = async ({
  ctx: {
    structure: { id },
    user
  }
}: {
  ctx: ProtectedAppContext
}) => {
  const { socialSupportSubjects, ...structure } =
    await StructureRepo.findUniqueOrThrow(user, {
      where: { id },
      include: {
        socialSupportSubjects: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    })

  // TODO remove optional & requires
  const optionalSubjects = socialSupportSubjects.filter(
    ({ legallyRequired }) => !legallyRequired
  )
  const requiredSubjects = socialSupportSubjects.filter(
    ({ legallyRequired }) => legallyRequired
  )
  return {
    structure,
    socialSupportSubjects,
    optionalSubjects,
    requiredSubjects
  }
}

export const getCurrentUserStructureQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
