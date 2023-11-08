import { structureRule } from '../permissions/rules'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditCurrentUserStructureInput,
  editCurrentUserStructureSchema
} from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { editFollowupTypes } from '~/utils/structure'
import { StructureRepo } from '~/server/database'

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

  await editFollowupTypes(
    user,
    userStructure.id,
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes
  )

  const updatedStructure = await StructureRepo.prisma.update({
    where: { id: userStructure.id },
    data: structure,
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        }
      }
    }
  })

  return updatedStructure
}

const securityCheck = (
  user: SecurityRuleGrantee,
  _input: EditCurrentUserStructureInput
) => {
  return structureRule.canEdit(user)
}

export const editCurrentUserStructureMutation = createMutation({
  handler,
  inputValidation: editCurrentUserStructureSchema,
  securityCheck
})
