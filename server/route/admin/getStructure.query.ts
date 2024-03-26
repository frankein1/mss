import { createQuery } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { SocialSupportSubjectRepo, StructureRepo } from '~/server/database'

const adminHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AdminContext
  input: IdInput
}) => {
  const { users, ...structure } = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: input.id },
    include: {
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

  const socialSupportSubjects = await SocialSupportSubjectRepo.findMany(user, {
    where: {
      ownedByStructureId: input.id,
      inactive: false
    },
    orderBy: {
      name: 'asc'
    }
  })

  return {
    structure,
    users,
    socialSupportSubjects
  }
}

export const getStructure = createQuery({
  adminHandler,
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck
})
