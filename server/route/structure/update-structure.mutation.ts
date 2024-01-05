import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditCurrentUserStructureInput,
  editCurrentUserStructureSchema
} from '~/server/schema'
import { SecurityRuleContext, canEditStructure } from '~/server/security'
import { editFollowupTypes } from '~/server/query/structure'
import { StructureRepo, FollowupTypeRepo } from '~/server/database'

const handler = async ({
  ctx: { structure: userStructure, user },
  input
}: {
  ctx: ProtectedAppContext
  input: EditCurrentUserStructureInput
}) => {
  const {
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes,
    ...structure
  } = input

  const currentFollowupTypes = await FollowupTypeRepo.findMany(user, {})

  await editFollowupTypes(
    userStructure.id,
    currentFollowupTypes,
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes
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

const securityCheck = (
  ctx: SecurityRuleContext,
  _input: EditCurrentUserStructureInput
) => {
  return canEditStructure(ctx.user)
}

export const editCurrentUserStructureMutation = createMutation({
  handler,
  inputValidation: editCurrentUserStructureSchema,
  securityCheck
})
