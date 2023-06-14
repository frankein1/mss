import { FollowupType, DefaultFollowupType } from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import type {
  EditCurrentUserStructureInput,
  CreateFollowupTypeInput
} from '~/server/schema'
import {
  defaultLegallyRequiredFollowupTypeLabels,
  defaultLegallyRequiredFollowupTypeOptions,
  defaultLegallyNotRequiredFollowupTypeLabels,
  defaultLegallyNotRequiredFollowupTypeOptions
} from '~/client/options/followupType'
import type { FollowupTypeWithSupportsCount } from '~/types/followupType'
import { canEditStructure } from '~/server/security/rules'

export const getCurrentUserStructureHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  const { structureId, status } = user

  if (status !== 'Active') {
    throw forbiddenError()
  }

  if (!structureId) {
    throw invalidError('Your user is not associated to a structure.')
  }

  return await prismaClient.structure.findUnique({
    where: { id: structureId },
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
}

export const editCurrentUserStructureHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: EditCurrentUserStructureInput
}) => {
  const { structureId } = user

  if (!structureId) {
    throw invalidError('Your user is not associated to a structure.')
  }

  if (!canEditStructure(user, { structureId })) {
    throw forbiddenError()
  }

  const {
    legallyRequiredFollowupTypes,
    legallyNotRequiredFollowupTypes,
    ...structure
  } = input

  const currentFollowupTypes = await prismaClient.followupType.findMany({
    where: { ownedByStructureId: structureId },
    include: {
      _count: {
        select: { followups: true, helpRequests: true }
      }
    }
  })

  const { toCreate, toDelete } = getFollowupTypeMutations(
    structureId,
    currentFollowupTypes,
    [...legallyRequiredFollowupTypes, ...legallyNotRequiredFollowupTypes]
  )

  if (toCreate.length) {
    await prismaClient.followupType.createMany({ data: toCreate })
  }

  if (toDelete.length) {
    await prismaClient.followupType.deleteMany({
      where: {
        id: {
          in: toDelete
        }
      }
    })
  }

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

// TODO: Test++
function getFollowupTypeMutations(
  structureId: string,
  currentFollowupTypes: FollowupTypeWithSupportsCount[],
  updatedFollowupTypes: string[]
) {
  return {
    toCreate: getFollowupTypesToCreate(
      structureId,
      currentFollowupTypes,
      updatedFollowupTypes
    ),
    toDelete: getFollowupTypesToDelete(
      currentFollowupTypes,
      updatedFollowupTypes
    )
  }
}

function getFollowupTypesToCreate(
  structureId: string,
  currentFollowupTypes: FollowupType[],
  updatedFollowupTypes: string[]
) {
  return updatedFollowupTypes.reduce((toCreate, updated) => {
    if (isDefaultLegallyRequiredFollowupType(updated)) {
      if (isAlreadySelected(currentFollowupTypes, updated, true)) {
        return toCreate
      }

      return [
        ...toCreate,
        getFollowupTypeToCreate(updated, true, true, structureId)
      ]
    }

    if (isDefaultLegallyNotRequiredFollowupType(updated)) {
      if (isAlreadySelected(currentFollowupTypes, updated, true)) {
        return toCreate
      }

      return [
        ...toCreate,
        getFollowupTypeToCreate(updated, true, false, structureId)
      ]
    }

    if (isAlreadySelected(currentFollowupTypes, updated, false)) {
      return toCreate
    }

    return [
      ...toCreate,
      getFollowupTypeToCreate(updated, false, false, structureId)
    ]
  }, [] as CreateFollowupTypeInput[])
}

function isDefaultLegallyRequiredFollowupType(
  id: string
): id is DefaultFollowupType {
  return defaultLegallyRequiredFollowupTypeOptions.has(id)
}

function isDefaultLegallyNotRequiredFollowupType(
  id: string
): id is DefaultFollowupType {
  return defaultLegallyNotRequiredFollowupTypeOptions.has(id)
}

function isAlreadySelected(
  currentFollowupTypes: FollowupType[],
  id: string,
  isDefault: boolean
) {
  if (isDefault) {
    return currentFollowupTypes.some(
      ({ default: isDefault }) => isDefault === id
    )
  }

  return currentFollowupTypes.some(f => f.id === id)
}

function getFollowupTypeToCreate(
  id: string,
  isDefault: boolean,
  legallyRequired: boolean,
  structureId: string
): CreateFollowupTypeInput {
  return {
    name: getFollowupTypeName(id, isDefault, legallyRequired),
    default: isDefault ? (id as DefaultFollowupType) : undefined,
    legallyRequired,
    ownedByStructureId: structureId
  }
}

function getFollowupTypeName(
  id: string,
  isDefault: boolean,
  legallyRequired: boolean
): string {
  if (isDefault) {
    if (legallyRequired) {
      return defaultLegallyRequiredFollowupTypeLabels[
        id as DefaultFollowupType
      ] as string
    }
    return defaultLegallyNotRequiredFollowupTypeLabels[
      id as DefaultFollowupType
    ] as string
  }
  return id
}

function getFollowupTypesToDelete(
  currentFollowupTypes: FollowupTypeWithSupportsCount[],
  updatedFollowupTypes: string[]
) {
  return currentFollowupTypes.reduce((toDelete, current) => {
    // Prevent deleting followup types already used fos supports
    if (current._count.followups || current._count.helpRequests) {
      return toDelete
    }

    if (current.default) {
      if (updatedFollowupTypes.includes(current.default)) {
        return toDelete
      }
      return [...toDelete, current.id]
    }

    if (updatedFollowupTypes.includes(current.id)) {
      return toDelete
    }

    return [...toDelete, current.id]
  }, [] as string[])
}
