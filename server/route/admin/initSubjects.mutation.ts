import { DefaultSocialSupportSubject } from '@prisma/client'
import { socialSupportSubjectKeys } from '~/client/options'
import { SocialSupportSubjectRepo, StructureRepo } from '~/server/database'
import { emptySchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { createMutation } from '~/server/route'
import { AdminContext } from '~/server/trpc'

async function adminHandler({ ctx }: { ctx: AdminContext }) {
  const structures = await StructureRepo.findMany(ctx.user, {
    select: { id: true, type: true }
  })

  for (const { id, type } of structures) {
    const keys = Object.keys(DefaultSocialSupportSubject)
    const context = {
      user: ctx.user,
      structure: {
        id,
        type
      }
    }
    for (const key of keys) {
      await initDefaultSubject(context, key as DefaultSocialSupportSubject)
    }
  }
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

export const initSubjects = createMutation({
  adminHandler,
  inputValidation: emptySchema
})
