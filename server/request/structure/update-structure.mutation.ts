import { createMutation } from '../createRequest'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import {
  EditCurrentUserStructureInput,
  editCurrentUserStructureSchema
} from '~/server/schema'
import {
  SecurityRuleGrantee,
  canEditItsOwnStructure
} from '~/server/security/rules'
import { editFollowupTypes } from '~/utils/structure'

const handler = async ({
  ctx: { structure: userStructure },
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
    userStructure.id,
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes
  )

  const updatedStructure = await prismaClient.structure.update({
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
