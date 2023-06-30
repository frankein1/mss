import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import type { EditCurrentUserStructureInput } from '~/server/schema'
import { canEditItsOwnStructure } from '~/server/security/rules'
import { editFollowupTypes } from '~/utils/structure'

export const editCurrentUserStructureHandler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: EditCurrentUserStructureInput
}) => {
  const { structureId } = user

  if (!canEditItsOwnStructure(user)) {
    throw forbiddenError()
  }

  const {
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes,
    ...structure
  } = input

  await editFollowupTypes(
    structureId,
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes
  )

  const updatedStructure = await prismaClient.structure.update({
    where: { id: structureId },
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
