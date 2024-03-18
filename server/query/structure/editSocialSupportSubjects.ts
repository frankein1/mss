import {
  SocialSupportSubject,
  DefaultSocialSupportSubject
} from '@prisma/client'
import {
  defaultLegallyRequiredSocialSupportSubjectLabels,
  defaultLegallyRequiredSocialSupportSubjectOptions,
  defaultLegallyNotRequiredSocialSupportSubjectLabels,
  defaultLegallyNotRequiredSocialSupportSubjectOptions
} from '~/client/options'
import { SocialSupportSubjectRepo } from '~/server/database'
import { CreateSocialSupportSubjectInput } from '~/server/schema'

export async function editSocialSupportSubjects(
  structureId: string,
  currentSocialSupportSubjects: SocialSupportSubject[],
  legallyRequiredSocialSupportSubjects: DefaultSocialSupportSubject[],
  legallyNotRequiredSocialSupportSubjects: (
    | DefaultSocialSupportSubject
    | string
  )[]
) {
  const { toCreate, toDelete } = getSocialSupportSubjectMutations(
    structureId,
    currentSocialSupportSubjects,
    [
      ...legallyRequiredSocialSupportSubjects,
      ...legallyNotRequiredSocialSupportSubjects
    ]
  )

  if (toCreate.length) {
    await SocialSupportSubjectRepo.prisma.createMany({ data: toCreate })
  }

  if (toDelete.length) {
    await SocialSupportSubjectRepo.prisma.deleteMany({
      where: {
        id: {
          in: toDelete
        }
      }
    })
  }
}

// TODO: Test++
function getSocialSupportSubjectMutations(
  structureId: string,
  currentSocialSupportSubjects: SocialSupportSubject[],
  updatedSocialSupportSubjects: string[]
) {
  return {
    toCreate: getSocialSupportSubjectsToCreate(
      structureId,
      currentSocialSupportSubjects,
      updatedSocialSupportSubjects
    ),
    toDelete: getSocialSupportSubjectsToDelete(
      currentSocialSupportSubjects,
      updatedSocialSupportSubjects
    )
  }
}

function getSocialSupportSubjectsToCreate(
  structureId: string,
  currentSocialSupportSubjects: SocialSupportSubject[],
  updatedSocialSupportSubjects: string[]
) {
  return updatedSocialSupportSubjects.reduce((toCreate, updated) => {
    if (isDefaultLegallyRequiredSocialSupportSubject(updated)) {
      if (isAlreadySelected(currentSocialSupportSubjects, updated, true)) {
        return toCreate
      }

      return [
        ...toCreate,
        getSocialSupportSubjectToCreate(updated, true, true, structureId)
      ]
    }

    if (isDefaultLegallyNotRequiredSocialSupportSubject(updated)) {
      if (isAlreadySelected(currentSocialSupportSubjects, updated, true)) {
        return toCreate
      }

      return [
        ...toCreate,
        getSocialSupportSubjectToCreate(updated, true, false, structureId)
      ]
    }

    if (isAlreadySelected(currentSocialSupportSubjects, updated, false)) {
      return toCreate
    }

    return [
      ...toCreate,
      getSocialSupportSubjectToCreate(updated, false, false, structureId)
    ]
  }, [] as CreateSocialSupportSubjectInput[])
}

function isDefaultLegallyRequiredSocialSupportSubject(
  id: string
): id is DefaultSocialSupportSubject {
  return hasOption(defaultLegallyRequiredSocialSupportSubjectOptions, id)
}

function isDefaultLegallyNotRequiredSocialSupportSubject(
  id: string
): id is DefaultSocialSupportSubject {
  return hasOption(defaultLegallyNotRequiredSocialSupportSubjectOptions, id)
}

function isAlreadySelected(
  currentSocialSupportSubjects: SocialSupportSubject[],
  id: string,
  isDefault: boolean
) {
  if (isDefault) {
    return currentSocialSupportSubjects.some(
      ({ default: isDefault }) => isDefault === id
    )
  }

  return currentSocialSupportSubjects.some(f => f.id === id)
}

function getSocialSupportSubjectToCreate(
  id: string,
  isDefault: boolean,
  legallyRequired: boolean,
  structureId: string
): CreateSocialSupportSubjectInput {
  return {
    name: getSocialSupportSubjectName(id, isDefault, legallyRequired),
    default: isDefault ? (id as DefaultSocialSupportSubject) : undefined,
    legallyRequired,
    ownedByStructureId: structureId
  }
}

function getSocialSupportSubjectName(
  id: string,
  isDefault: boolean,
  legallyRequired: boolean
): string {
  if (isDefault) {
    if (legallyRequired) {
      return defaultLegallyRequiredSocialSupportSubjectLabels[
        id as DefaultSocialSupportSubject
      ] as string
    }
    return defaultLegallyNotRequiredSocialSupportSubjectLabels[
      id as DefaultSocialSupportSubject
    ] as string
  }
  return id
}

function getSocialSupportSubjectsToDelete(
  currentSocialSupportSubjects: SocialSupportSubject[],
  updatedSocialSupportSubjects: string[]
) {
  return currentSocialSupportSubjects.reduce((toDelete, current) => {
    if (current.used) {
      return toDelete
    }

    if (current.default) {
      if (updatedSocialSupportSubjects.includes(current.default)) {
        return toDelete
      }
      return [...toDelete, current.id]
    }

    if (updatedSocialSupportSubjects.includes(current.id)) {
      return toDelete
    }

    return [...toDelete, current.id]
  }, [] as string[])
}
