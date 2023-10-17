import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureRepo } from '~/server/database'

const handler = async ({
  ctx: { structure, user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await StructureRepo.findUniqueOrThrow(user, {
    where: { id: structure.id },
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
  })
}

export const getCurrentUserStructureQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
