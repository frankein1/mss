import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { CreateViewUrlInput } from '~/server/schema'
import { createViewUrlSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { DocumentRepo } from '~/server/database'
import { DocumentService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: CreateViewUrlInput
) => {
  const { permissions } = await DocumentService.getEditionPermissions(
    ctx,
    input.key
  )

  return permissions.view
}

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: CreateViewUrlInput
}) => {
  const { key } = input
  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    include: {
      documentContent: true
    }
  })

  return {
    content: document.documentContent?.content,
    name: document.name
  }
}

export const createViewUrlMutation = createMutation({
  inputValidation: createViewUrlSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'document.getViewUrl',
    target: 'Document',
    targetId: ({ input }) => {
      return input.key
    },
    action: UserActivityType.VIEW
  }
})
