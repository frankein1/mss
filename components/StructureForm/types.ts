import type { Structure, DefaultFollowupType } from '@prisma/client'
import type { FollowupTypeWithSupportsCount } from '~/types/followupType'

export type StructureWithFollowupTypesWithSupportsCount = Structure & {
  followupTypes: FollowupTypeWithSupportsCount[]
}

export type DefaultLegallyRequiredFollowupTypeWithSupportsCount =
  FollowupTypeWithSupportsCount & {
    default: DefaultFollowupType
    legallyRequired: true
  }

export type DefaultLegallyNotRequiredFollowupTypeWithSupportsCount =
  FollowupTypeWithSupportsCount & {
    default: DefaultFollowupType
    legallyRequired: false
  }
