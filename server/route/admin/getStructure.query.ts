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
  const structure = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: input.id }
  })

  const socialSupportSubjects = await SocialSupportSubjectRepo.findMany(user, {
    where: {
      inactive: false
    },
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
  adminHandler,
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck
})
