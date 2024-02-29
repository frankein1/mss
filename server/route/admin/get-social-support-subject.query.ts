import { createQuery } from '~/server/route'
import { AdminContext } from '~/server/trpc'
import {
  GetSocialSupportSubjectInput,
  getSocialSupportSubjectSchema
} from '~/server/schema'
import { SocialSupportSubjectRepo } from '~/server/database'

const adminHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AdminContext
  input: GetSocialSupportSubjectInput
}) => {
  const subjects = await SocialSupportSubjectRepo.findMany(user, {
    where: {
      name: { equals: input.name, mode: 'insensitive' },
      ownedByStructureId: input.structureId
    }
  })
  return subjects.length > 0 ? subjects[0] : null
}

export const getAdminSocialSupportSubjectQuery = createQuery({
  adminHandler,
  inputValidation: getSocialSupportSubjectSchema
})
