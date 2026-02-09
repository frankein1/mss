import type { Prisma } from '~/prisma/generated/client'
import { NotificationType } from '~/prisma/generated/client'
import { CommentRepo, SocialSupportRepo } from '~/server/database'
import type { AddCommentInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security'
import { getCommentPermissions } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'

function getTargetedSocialSupport(
  user: SecurityRuleGrantee,
  socialSupportId: string
) {
  return SocialSupportRepo.findUniqueOrThrow(user, {
    where: { id: socialSupportId },
    select: {
      id: true,
      createdById: true,
      familyFile: { select: { referents: { select: { id: true } } } }
    }
  })
}

type TargetedSocialSupport = Awaited<
  ReturnType<typeof getTargetedSocialSupport>
>

function prepareNotifications(
  userId: string,
  beneficiaryId: string,
  socialSupport: TargetedSocialSupport
) {
  const notifications: Prisma.NotificationCreateManyCommentInput[] = []

  if (socialSupport.createdById !== userId) {
    notifications.push({
      recipientId: socialSupport.createdById,
      beneficiaryId,
      socialSupportId: socialSupport.id,
      type: NotificationType.NewComment,
      itemCreatedById: userId
    })
  }

  socialSupport.familyFile.referents.forEach(({ id: referentId }) => {
    if (referentId === userId || referentId === socialSupport.createdById) {
      return
    }

    notifications.push({
      recipientId: referentId,
      beneficiaryId,
      socialSupportId: socialSupport.id,
      type: NotificationType.NewComment,
      itemCreatedById: userId
    })
  })

  return notifications
}

export const create = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: AddCommentInput
}) => {
  const { user } = ctx
  const socialSupport = await getTargetedSocialSupport(
    user,
    input.socialSupportId
  )

  const notificationsToCreate = prepareNotifications(
    user.id,
    input.beneficiaryId,
    socialSupport
  )

  const comment = await CommentRepo.prisma.create({
    data: {
      content: input.content,
      createdById: user.id,
      socialSupportId: socialSupport.id,
      notification: {
        createMany: {
          data: notificationsToCreate
        }
      }
    },
    include: {
      createdBy: true
    }
  })

  const permissions = getCommentPermissions({
    ctx,
    comment
  })

  return { comment, permissions }
}
