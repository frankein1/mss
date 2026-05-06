import { z } from 'zod'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { forbidden } from '~/utils/api/errors'

const inputValidation = z.object({ id: z.string().uuid() })
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
    select: { id: true, s3Key: true, createdById: true }
  })

  if (!template) {
    throw forbidden('Modèle introuvable')
  }

  const isManager = ctx.user.role === 'StructureManager'
  const isOwner = template.createdById === ctx.user.id
  if (!isManager && !isOwner) {
    throw forbidden('Action non autorisée')
  }

  if (template.s3Key) {
    const { deleteFile } = await import('~/server/lib/s3/file')
    const config = useRuntimeConfig()
    await deleteFile(config as any, template.s3Key).catch(() => {})
  }

  await prismaClient.letterTemplate.delete({ where: { id: input.id } })
  return { success: true }
}

export const deleteLetterTemplateMutation = createMutation({
  inputValidation,
  securityCheck: async () => true,
  handler
})
