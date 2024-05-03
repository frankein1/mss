import { NotificationType } from '@prisma/client'
import { NotificationRepo, StructureRepo } from '~/server/database'
import { UpdateSocialSupportSubjectsInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'

export const updateSocialSupportSubjects = async ({
  input,
  ctx
}: {
  input: UpdateSocialSupportSubjectsInput
  ctx: SecurityRuleContext
}) => {
  const update = input.selected.map(sss => ({
    where: {
      id: sss.id
    },
    data: {
      inactive: !sss.active
    }
  }))
  const create = input.customs.map(sss => ({
    inactive: false,
    name: sss.name
  }))

  const res = await StructureRepo.prisma.update({
    where: { id: ctx.structure.id },
    data: {
      socialSupportSubjects: {
        update,
        createMany: {
          data: create
        }
      }
    },
    select: {
      id: true,
      users: {
        select: {
          id: true
        }
      }
    }
  })

  const { id, users } = res

  const notifications = users.map(recipient => ({
    recipientId: recipient.id,
    type: NotificationType.NewSocialSupportSubject,
    itemCreatedById: ctx.user.id,
    detail: create.map(object => object.name).join(', ')
  }))

  NotificationRepo.prisma.createMany({ data: notifications })

  return { id }
}
