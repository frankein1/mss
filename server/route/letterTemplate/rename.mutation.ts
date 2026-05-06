import { z } from 'zod'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { forbidden } from '~/utils/api/errors'

const inputValidation = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200)
})
type Input = z.infer<typeof inputValidation>

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: Input
}) => {
  const template = await prismaClient.letterTemplate.findFirst({
    where: { id: input.id, structureId: ctx.user.structureId as string },
    select: { id: true }
  })

  if (!template) {
    throw forbidden('Modèle introuvable')
  }

  return prismaClient.letterTemplate.update({
    where: { id: input.id },
    data: { name: input.name },
    select: { id: true, name: true }
  })
}

export const renameLetterTemplateMutation = createMutation({
  inputValidation,
  securityCheck: async () => true,
  handler
})
