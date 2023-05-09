import type {
  Structure,
  FollowupType,
  DefaultLegallyRequiredFollowupType,
  DefaultLegallyNotRequiredFollowupType
} from '@prisma/client'
import type { EditCurrentUserStructureInput } from '~/server/schema'
import type { FollowupTypeWithSupportsCount } from '~/types/followupType'

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
