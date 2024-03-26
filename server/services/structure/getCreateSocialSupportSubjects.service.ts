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
  return await SocialSupportSubjectRepo.findMany(ctx.user, {
    where: {
      ownedByStructureId: ctx.structure.id
    },
    orderBy: {
      name: 'asc'
    }
  })
}

async function initDefaultSubject(
  ctx: SecurityRuleContext,
  key: DefaultSocialSupportSubject
) {
  const res = await SocialSupportSubjectRepo.findMany(ctx.user, {
    where: {
      ownedByStructureId: ctx.structure.id,
      OR: [
        {
          default: {
            equals: key as DefaultSocialSupportSubject
          }
        },
        {
          name: socialSupportSubjectKeys.value(key) || ''
        }
      ]
    },
    take: 1
  })
  if (res.length === 0) {
    await SocialSupportSubjectRepo.prisma.create({
      data: {
        default: key as DefaultSocialSupportSubject,
        ownedByStructureId: ctx.structure.id,
        name: socialSupportSubjectKeys.value(key) || key,
        inactive: true
      }
    })
  } else {
    const oa = res[0]
    await SocialSupportSubjectRepo.prisma.update({
      where: {
        id: oa.id
      },
      data: {
        name: socialSupportSubjectKeys.value(key) || key,
        default: key as DefaultSocialSupportSubject
      }
    })
  }
}
