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
          orderBy: {
            name: 'asc'
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
  const optionalTypes = followupTypes.filter(type => !type.legallyRequired)
  const requiredTypes = followupTypes.filter(type => type.legallyRequired)
  return { structure, users, optionalTypes, requiredTypes }
}

export const getAdminStructureQuery = createQuery({
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
