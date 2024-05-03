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

  const previous = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.structure.id },
    select: {
      socialSupportSubjects: {
        select: {
          name: true,
          inactive: true
        }
      }
    }
  })

  const previousNames = previous.socialSupportSubjects
    .filter(s => !s.inactive)
    .map(s => s.name)

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

  const objects = create.map(object => object.name)
  objects.push(...input.selected.filter(s => s.active).map(s => s.name))

  const newObjects = objects.filter(object => !previousNames.includes(object))

  const notifications = users
    .filter(u => u.id !== ctx.user.id)
    .map(recipient => ({
      recipientId: recipient.id,
      type: NotificationType.NewSocialSupportSubject,
      itemCreatedById: ctx.user.id,
      detail: newObjects.join(', ')
    }))

  await NotificationRepo.prisma.createMany({ data: notifications })

  return { id }
}
