import {
  SecurityRuleContext
  // getSocialSupportPermissions,
  // getAppContextPermissions
} from '~/server/security'
import {
  // FamilyFileSecurityTarget,
  getFamilyFileSecurityTarget
} from './permission.service'
import { SocialSupportRepo } from '~/server/database'
import { GetHistoryInput } from '~/server/schema'
import { prepareSocialSupportFilters } from './helper'
// import {
//   filterSocialSupport,
//   filterFollowup,
//   filterFileInstruction
// } from '~/server/services/helper'
import {
  FileInstruction,
  Followup,
  SocialSupportSubject,
  SocialSupport,
  User,
  Beneficiary
  // FamilyFile
} from '@prisma/client'

const socialSupportInclude = (userId: string) => ({
  createdBy: true,
  lastUpdatedBy: true,
  // familyFile: {
  //   include: {
  //     referents: true
  //   }
  // },
  beneficiary: {
    select: {
      id: true,
      usualName: true,
      birthName: true,
      firstName: true
    }
  },
  fileInstruction: true,
  followup: true,
  subjects: true,
  _count: {
    select: {
      notifications: {
        where: { read: false, recipientId: userId }
      }
    }
  }
})

type SocialSupports = (SocialSupport & {
  createdBy: User
  lastUpdatedBy: User | null
  // familyFile: FamilyFile & {
  //   referents: User[]
  // }
  beneficiary: Pick<Beneficiary, 'id' | 'usualName' | 'birthName' | 'firstName'>
  subjects: SocialSupportSubject[]
  _count: { notifications: number }
  followup: Followup | null
  fileInstruction: FileInstruction | null
})[]

// No access permission is needed for access to summary data
function formatResult(socialSupports: SocialSupports) {
  return socialSupports.map(socialSupport => {
    const { _count, followup, fileInstruction, ...ss } = socialSupport

    return {
      data: {
        ...ss,
        hasUnreadNotifications: !!_count.notifications,
        followup,
        fileInstruction
      }
    }
  })
}

export async function getSocialSupportsSummary({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetHistoryInput
}) {
  const { familyFileId, filters } = input

  const [totalCount, socialSupports] = await Promise.all([
    SocialSupportRepo.count(ctx.user, { where: { familyFileId } }),
    SocialSupportRepo.findMany(ctx.user, {
      where: prepareSocialSupportFilters(filters, familyFileId),
      include: socialSupportInclude(ctx.user.id),
      orderBy: [{ date: 'desc' }, { created: 'desc' }]
    })
  ])

  return {
    items: formatResult(socialSupports),
    totalCount
  }
}
