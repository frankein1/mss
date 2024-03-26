import { createMutation } from '~/server/route'
import { CreateStructureInput, createStructureSchema } from '~/server/schema'
import { AdminContext } from '~/server/trpc'
import { StructureRepo } from '~/server/database'
import { createEmail } from '~/server/query'
import { getStructureCreationEmailContent } from '~/server/email'

const adminHandler = async ({
  ctx: _ctx,
  input
}: {
  ctx: AdminContext
  input: CreateStructureInput
}) => {
  const createdStructure = await StructureRepo.prisma.create({
    data: input,
    include: {
      socialSupportSubjects: {
        include: {
          _count: {
            select: { socialSupports: true }
          }
        }
      }
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
