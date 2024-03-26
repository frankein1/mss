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
  const name = socialSupportSubjectKeys.value(key) || ''
  const ownedByStructureId = ctx.structure.id
  const res = await SocialSupportSubjectRepo.findMany(ctx.user, {
    where: {
      ownedByStructureId,
      name
    },
    take: 1
  })
  if (res.length === 0) {
    await SocialSupportSubjectRepo.prisma.create({
      data: {
        default: key as DefaultSocialSupportSubject,
        ownedByStructureId,
        name,
        inactive: true
      }
    })
  }
}

export const initSubjects = createMutation({
  adminHandler,
  inputValidation: emptySchema
})
