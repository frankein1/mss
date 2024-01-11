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
  HelpRequestPermissions,
  getHelpRequestPermissions
} from './getHelpRequestPermissions'

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
}): FollowupPermissions | HelpRequestPermissions {
  return socialSupport.socialSupportType === 'Followup'
    ? getFollowupPermissions({ user: ctx.user, beneficiary, socialSupport })
    : getHelpRequestPermissions({ ctx, beneficiary, socialSupport })
}
