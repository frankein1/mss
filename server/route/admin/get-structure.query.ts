import { createQuery } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { idSchema } from '~/server/schema'
import { StructureRepo } from '~/server/database'

const adminHandler = async ({
  ctx: { user },
  input: { id }
}: {
  ctx: AdminContext
  input: { id: string }
}) => {
  const { followupTypes, users, ...structure } =
    await StructureRepo.findUniqueOrThrow(user, {
      where: { id },
      include: {
        followupTypes: {
          include: {
            _count: {
              select: { followups: true, helpRequests: true }
            }
          }
        },
        users: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            email: true,
            role: true,
            aidantConnectAuthorisation: true,
            status: true
          },
          orderBy: {
            created: 'desc'
          }
        }
      }
    })
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
  return { structure, users, optionalTypes, requiredTypes }
}

export const getAdminStructureQuery = createQuery({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
