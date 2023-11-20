import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditCurrentUserStructureInput,
  editCurrentUserStructureSchema
} from '~/server/schema'
import { SecurityRuleGrantee, canEditStructure } from '~/server/security'
import { editFollowupTypes } from '~/utils/structure'
import { StructureRepo, FollowupTypeRepo } from '~/server/database'
import { PrismaErrorCode } from '~/utils/constants/prisma'

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

  const currentFollowupTypes = await FollowupTypeRepo.findMany(user, {
    include: {
      _count: {
        select: { followups: true, helpRequests: true }
      }
    }
  })

  try {
    await editFollowupTypes(
      userStructure.id,
      currentFollowupTypes,
      legallyRequiredFollowupTypes,
      legallyNotRequiredFollowupTypes
    )
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === PrismaErrorCode.UniqueConstraintFailed
    ) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: "Un type d'accompagnement avec le même nom existe déjà."
      })
    }
  }

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
  return canEditStructure(user)
}

export const editCurrentUserStructureMutation = createMutation({
  handler,
  inputValidation: editCurrentUserStructureSchema,
  securityCheck
})
