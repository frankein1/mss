import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditCurrentUserStructureInput,
  editCurrentUserStructureSchema
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { editSocialSupportSubjects } from '~/server/query/structure'
import { StructureRepo, SocialSupportSubjectRepo } from '~/server/database'

const handler = async ({
  ctx: { structure: userStructure, user },
  input
}: {
  ctx: ProtectedAppContext
  input: EditCurrentUserStructureInput
}) => {
  const {
    legallyRequiredSocialSupportSubjects,
    legallyNotRequiredSocialSupportSubjects,
    ...structure
  } = input

  const currentSocialSupportSubjects = await SocialSupportSubjectRepo.findMany(
    user,
    {}
  )

  await editSocialSupportSubjects(
    userStructure.id,
    currentSocialSupportSubjects,
    legallyRequiredSocialSupportSubjects,
    legallyNotRequiredSocialSupportSubjects
  )

  const updatedStructure = await StructureRepo.prisma.update({
    where: { id: userStructure.id },
    data: structure,
    select: {
      id: true
    }
  })

  return updatedStructure
}

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

export const updateStructure = createMutation({
  handler,
  inputValidation: editCurrentUserStructureSchema,
  securityCheck
})
