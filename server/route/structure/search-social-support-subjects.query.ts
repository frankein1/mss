import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SearchSocialSupportSubjectsInput,
  searchSocialSupportSubjectsSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { SocialSupportSubjectRepo } from '~/server/database'
import RemoveAccents from 'remove-accents'

const handler = async ({
  ctx: { user, structure },
  input
}: {
  ctx: ProtectedAppContext
  input: SearchSocialSupportSubjectsInput
}) => {
  const cleanedInputs = input.map(i =>
    RemoveAccents.remove(i.name.trim().toLowerCase())
  )
  console.log(cleanedInputs)

  const subjects = await SocialSupportSubjectRepo.findMany(user, {
    select: { id: true, name: true },
    where: {
      OR: cleanedInputs.map(input => ({
        name: { equals: input, mode: 'insensitive' }
      })),
      ownedByStructureId: structure.id
    }
  })
  return subjects
}

export const searchSocialSupportSubjects = createQuery({
  handler,
  inputValidation: searchSocialSupportSubjectsSchema,
  securityCheck: AllowSecurityCheck
})
