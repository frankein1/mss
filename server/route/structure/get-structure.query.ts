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
          include: {
            _count: {
              select: { followups: true, helpRequests: true }
            }
          },
          orderBy: {
            name: 'asc'
          }
        }
      }
    }
  )
  const optionalTypes = followupTypes
    .filter(type => !type.legallyRequired)
    .map(({ _count, ...type }) => ({
      used: _count.followups > 0 || _count.helpRequests > 0,
      type
    }))
  const requiredTypes = followupTypes
    .filter(type => type.legallyRequired)
    .map(({ _count, ...type }) => ({
      used: _count.followups > 0 || _count.helpRequests > 0,
      type
    }))
  return { structure, optionalTypes, requiredTypes }
}

export const getCurrentUserStructureQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
