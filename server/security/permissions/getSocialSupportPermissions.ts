import { SocialSupport } from '@prisma/client'
import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure,
  SecurityTargetWithCreator,
  SecurityRuleContext
} from '../rules'
import {
  FollowupPermissions,
  getFollowupPermissions
} from './getFollowupPermissions'
import {
  FileInstructionPermissions,
  getFileInstructionPermissions
} from './getFileInstructionPermissions'

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
