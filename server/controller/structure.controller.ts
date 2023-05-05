import {
  UserRole,
  FollowupType,
  DefaultLegallyNotRequiredFollowupType,
  DefaultLegallyRequiredFollowupType
} from '@prisma/client'
import { AppContext, invalidError, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import type {
  EditCurrentUserStructureInput,
  CreateFollowupTypeInput,
  FollowupTypeWithSupportsCount
} from '~/server/schema'
import {
  defaultLegallyRequiredFollowupTypeLabels,
  defaultLegallyNotRequiredFollowupTypeLabels
} from '~/client/options/followupType'

export const getCurrentUserStructureHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  const { structureId } = user

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
  // [NUXT/PRISMA]: Factorise with rules
  if (user.role !== UserRole.StructureManager) {
    throw forbiddenError()
  }

  const { structureId } = user

  if (!structureId) {
    throw invalidError('Your user is not associated to a structure.')
  }

  const { followupTypes, ...structure } = input

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
    followupTypes
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
      if (isAlreadySelected(currentFollowupTypes, updated, true, true)) {
        return toCreate
      }

      return [
        ...toCreate,
        getFollowupTypeToCreate(updated, true, true, structureId)
      ]
    }

    if (isDefaultLegallyNotRequiredFollowupType(updated)) {
      if (isAlreadySelected(currentFollowupTypes, updated, true, false)) {
        return toCreate
      }

      return [
        ...toCreate,
        getFollowupTypeToCreate(updated, true, false, structureId)
      ]
    }

    if (isAlreadySelected(currentFollowupTypes, updated, false, false)) {
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
): id is DefaultLegallyRequiredFollowupType {
  return Object.values(DefaultLegallyRequiredFollowupType).includes(
    id as DefaultLegallyRequiredFollowupType
  )
}

function isDefaultLegallyNotRequiredFollowupType(
  id: string
): id is DefaultLegallyNotRequiredFollowupType {
  return Object.values(DefaultLegallyNotRequiredFollowupType).includes(
    id as DefaultLegallyNotRequiredFollowupType
  )
}

function isAlreadySelected(
  currentFollowupTypes: FollowupType[],
  id: string,
  isDefault: boolean,
  legallyRequired: boolean
) {
  if (isDefault) {
    if (legallyRequired) {
      return currentFollowupTypes.some(
        ({ defaultLegallyRequiredKey }) => defaultLegallyRequiredKey === id
      )
    }

    return currentFollowupTypes.some(
      ({ defaultLegallyNotRequiredKey }) => defaultLegallyNotRequiredKey === id
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
    default: isDefault,
    legallyRequired,
    defaultLegallyRequiredKey:
      isDefault && legallyRequired
        ? (id as DefaultLegallyRequiredFollowupType)
        : undefined,
    defaultLegallyNotRequiredKey:
      isDefault && !legallyRequired
        ? (id as DefaultLegallyNotRequiredFollowupType)
        : undefined,
    ownedByStructureId: structureId
  }
}

function getFollowupTypeName(
  id: string,
  isDefault: boolean,
  legallyRequired: boolean
) {
  if (isDefault) {
    if (legallyRequired) {
      return defaultLegallyRequiredFollowupTypeLabels[
        id as DefaultLegallyRequiredFollowupType
      ]
    }
    return defaultLegallyNotRequiredFollowupTypeLabels[
      id as DefaultLegallyNotRequiredFollowupType
    ]
  }
  return id
}

function getFollowupTypesToDelete(
  currentFollowupTypes: FollowupTypeWithSupportsCount[],
  updatedFollowupTypes: string[]
) {
  return currentFollowupTypes.reduce((toDelete, current) => {
    // Prevent deleting followup types already used fos supports
    if (current._count.followups || current._count.helpRequests) return toDelete

    if (current.defaultLegallyRequiredKey) {
      if (updatedFollowupTypes.includes(current.defaultLegallyRequiredKey)) {
        return toDelete
      }
      return [...toDelete, current.id]
    }

    if (current.defaultLegallyNotRequiredKey) {
      if (updatedFollowupTypes.includes(current.defaultLegallyNotRequiredKey)) {
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
