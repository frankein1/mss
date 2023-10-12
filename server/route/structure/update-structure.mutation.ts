import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditCurrentUserStructureInput,
  editCurrentUserStructureSchema
} from '~/server/schema'
import {
  SecurityRuleGrantee,
  canEditItsOwnStructure
} from '~/server/security/rules'
import { editFollowupTypes } from '~/utils/structure'
import { StructureRepo } from '~/server/repository'

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

  const updatedStructure = await StructureRepo.update(user, {
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
  return canEditItsOwnStructure(user)
}

export const editCurrentUserStructureMutation = createMutation({
  handler,
  inputValidation: editCurrentUserStructureSchema,
  securityCheck
})
