import {
  DefaultSocialSupportSubject,
  UserActivityType
} from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { CreateStructureInput } from '~/server/schema'
import { createStructureSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import { StructureRepo } from '~/server/database'
import { createEmail } from '~/server/query'
import { getStructureCreationEmailContent } from '~/server/email'
import { socialSupportSubjectKeys } from '~/client/options'
import { createEmailSubject } from '~/server/email/createEmailSubject'
import { createOrUpdateStructure } from '~/server/integrations/brevo/service'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: CreateStructureInput
}) => {
  const keys = Object.keys(DefaultSocialSupportSubject)

  const createdStructure = await StructureRepo.prisma.create({
    data: {
      ...input,
      socialSupportSubjects: {
        createMany: {
          data: keys.map(key => ({
            default: key as DefaultSocialSupportSubject,
            name: socialSupportSubjectKeys.value(key) || key,
            inactive: true
          }))
        }
      }
    },
    select: {
      id: true
    }
  })

  await createEmail({
    to: input.email,
    subject: createEmailSubject('Mon Suivi Social - Votre espace a été créé'),
    ...getStructureCreationEmailContent()
  })
  createOrUpdateStructure(createdStructure.id).catch(error => {
    console.error(error)
  })

  return createdStructure
}

export const createStructure = createMutation({
  inputValidation: createStructureSchema,
  adminHandler,
  auditLog: {
    key: 'admin.structure.create',
    target: 'Structure',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
