import type { SocialSupport } from '@prisma/client'
import type {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator,
  SecurityRuleContext
} from '../rules'
import type { FollowupPermissions } from './getFollowupPermissions'
import { getFollowupPermissions } from './getFollowupPermissions'
import type { FileInstructionPermissions } from './getFileInstructionPermissions'
import { getFileInstructionPermissions } from './getFileInstructionPermissions'

export function getSocialSupportPermissions({
  ctx,
  familyFile,
  socialSupport
}: {
  ctx: SecurityRuleContext
  familyFile: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator &
    SecurityTargetWithStructure &
    Pick<SocialSupport, 'socialSupportType'>
}): FollowupPermissions | FileInstructionPermissions {
  return socialSupport.socialSupportType === 'Followup'
    ? getFollowupPermissions({ ctx, familyFile, socialSupport })
    : getFileInstructionPermissions({ ctx, familyFile, socialSupport })
}
