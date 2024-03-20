import { DefaultSocialSupportSubject } from '@prisma/client'
import { socialSupportSubjectKeys } from '~/client/options'
import { SocialSupportSubjectRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function getCreateSocialSupportSubjects({
  ctx
}: {
  ctx: SecurityRuleContext
}) {
  const keys = Object.keys(DefaultSocialSupportSubject)

  for (const key of keys) {
    await initDefaultSubject(ctx, key as DefaultSocialSupportSubject)
  }
  return await SocialSupportSubjectRepo.findManyWithNoInactiveCondition(
    ctx.user,
    {
      orderBy: {
        name: 'asc'
      }
    }
  )
}

async function initDefaultSubject(
  ctx: SecurityRuleContext,
  key: DefaultSocialSupportSubject
) {
  const res = await SocialSupportSubjectRepo.findManyWithNoInactiveCondition(
    ctx.user,
    {
      where: {
        ownedByStructureId: ctx.structure.id,
        default: {
          equals: key as DefaultSocialSupportSubject
        }
      },
      take: 1
    }
  )
  if (res.length === 0) {
    await SocialSupportSubjectRepo.prisma.create({
      data: {
        default: key as DefaultSocialSupportSubject,
        ownedByStructureId: ctx.structure.id,
        name: socialSupportSubjectKeys.value(key) || key,
        inactive: true
      }
    })
  }
}
