import { createQuery } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import { idSchema } from '~/server/schema'
import { StructureRepo } from '~/server/database'

const adminHandler = async ({
  ctx: { user },
  input: { id }
}: {
  ctx: AdminContext
  input: { id: string }
}) => {
  const { socialSupportSubjects, users, ...structure } =
    await StructureRepo.findUniqueOrThrow(user, {
      where: { id },
      include: {
        socialSupportSubjects: {
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
  const optionalSubjects = socialSupportSubjects.filter(
    ({ legallyRequired }) => !legallyRequired
  )
  const requiredSubjects = socialSupportSubjects.filter(
    ({ legallyRequired }) => legallyRequired
  )
  return { structure, users, optionalSubjects, requiredSubjects }
}

export const getAdminStructureQuery = createQuery({
  inputValidation: idSchema,
  adminHandler
})
