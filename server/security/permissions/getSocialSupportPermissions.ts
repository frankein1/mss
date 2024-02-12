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
  beneficiary,
  socialSupport
}: {
  ctx: SecurityRuleContext
  beneficiary: SecurityTargetWithStructure & SecurityTargetWithReferents
  socialSupport: SecurityTargetWithCreator &
    SecurityTargetWithStructure &
    Pick<SocialSupport, 'socialSupportType'>
}): FollowupPermissions | FileInstructionPermissions {
  return socialSupport.socialSupportType === 'Followup'
    ? getFollowupPermissions({ ctx, beneficiary, socialSupport })
    : getFileInstructionPermissions({ ctx, beneficiary, socialSupport })
}
