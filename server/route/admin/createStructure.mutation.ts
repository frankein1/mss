import { DefaultSocialSupportSubject } from '@prisma/client'
import { createMutation } from '~/server/route'
import { CreateStructureInput, createStructureSchema } from '~/server/schema'
import { AdminContext } from '~/server/trpc'
import { StructureRepo } from '~/server/database'
import { createEmail } from '~/server/query'
import { getStructureCreationEmailContent } from '~/server/email'
import { socialSupportSubjectKeys } from '~/client/options'

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

  createEmail({
    to: input.email,
    subject: 'Mon Suivi Social - Votre espace a été créé',
    ...getStructureCreationEmailContent()
  })

  return createdStructure
}

export const createStructure = createMutation({
  inputValidation: createStructureSchema,
  adminHandler
})
