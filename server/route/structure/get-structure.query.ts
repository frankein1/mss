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
  const { followupTypes, ...structure } = await StructureRepo.findUniqueOrThrow(
    user,
    {
      where: { id },
      include: {
        followupTypes: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    }
  )
  const optionalTypes = followupTypes.filter(type => !type.legallyRequired)
  const requiredTypes = followupTypes.filter(type => type.legallyRequired)
  return { structure, optionalTypes, requiredTypes }
}

export const getCurrentUserStructureQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
