import type {
  Structure,
  FollowupType,
  DefaultLegallyRequiredFollowupType,
  DefaultLegallyNotRequiredFollowupType
} from '@prisma/client'
import type {
  EditCurrentUserStructureInput,
  FollowupTypeWithSupportsCount
} from '~/server/schema'

export type StructureWithFollowupTypesWithSupportsCount = Structure & {
  followupTypes: FollowupTypeWithSupportsCount[]
}

export type DefaultLegallyRequiredFollowupTypeWithSupportsCount =
  FollowupTypeWithSupportsCount & {
    defaultLegallyRequiredKey: DefaultLegallyRequiredFollowupType
    defaultLegallyNotRequiredKey: null
  }

export type DefaultLegallyNotRequiredFollowupTypeWithSupportsCount =
  FollowupTypeWithSupportsCount & {
    defaultLegallyRequiredKey: null
    defaultLegallyNotRequiredKey: DefaultLegallyNotRequiredFollowupType
  }

export type CustomFollowupTypeWithSupportsCount =
  FollowupTypeWithSupportsCount & {
    default: false
    legallyRequired: false
  }

export type EditCurrentUserStructureSubmit = Omit<
  EditCurrentUserStructureInput,
  'followupTypes'
> & {
  legallyRequiredFollowupTypes: string
  legallyNotRequiredFollowupTypes: string
}
