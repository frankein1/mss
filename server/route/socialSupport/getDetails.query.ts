import type { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import type { IdInput } from '~/server/schema'
import { idSchema } from '~/server/schema'
import { SocialSupportRepo } from '~/server/database'
import { SocialSupportService } from '~/server/services'
import { formatSocialSupportDetail } from './utils'

async function getSocialSupportDetail({
  ctx,
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) {
  return SocialSupportRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    include: {
      createdBy: true,
      lastUpdatedBy: true,
      familyFile: {
        include: {
          referents: true
        }
      },
      beneficiary: true,
      documents: true,
      comments: {
        orderBy: { created: 'asc' },
        include: {
          createdBy: true
        }
      },
      fileInstruction: {
        include: {
          instructorOrganization: true,
          instructorOrganizationContact: true,
          helpRequest: {
            include: {
              prescribingOrganization: true,
              prescribingOrganizationContact: true
            }
          },
          housingHelpRequest: {
            include: {
              prescribingOrganization: true,
              prescribingOrganizationContact: true
            }
          }
        }
      },
      followup: {
        include: {
          prescribingOrganization: true,
          prescribingOrganizationContact: true
        }
      },
      subjects: true,
      _count: {
        select: {
          notifications: {
            where: { read: false, recipientId: ctx.user.id }
          }
        }
      }
    }
  })
}

const handler = async ({
  ctx,
  input
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const socialSupport = await getSocialSupportDetail({ ctx, input })

  return formatSocialSupportDetail(socialSupport, ctx, socialSupport.familyFile)
}

export type SocialSupportDetail = Prisma.PromiseReturnType<
  typeof getSocialSupportDetail
>

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await SocialSupportService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.view
}

export const getDetails = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
