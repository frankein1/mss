import { UserActivityType } from '@prisma/client'
import { createQuery } from '~/server/route'
import type { GetSignedUrlInput } from '~/server/schema'
import { getSignedUrlSchema } from '~/server/schema'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { DocumentRepo } from '~/server/database'
import { DocumentService } from '~/server/services'
import { getSignedUrlForRead } from '~/server/lib/s3/signed-url'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetSignedUrlInput
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
  input: GetSignedUrlInput
}) => {
  const config = useRuntimeConfig()

  const { key } = input
  const { filenameDisk } = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    select: { filenameDisk: true }
  })

  const url = await getSignedUrlForRead(config.s3, filenameDisk)

  return url
}

export const getSignedUrlQuery = createQuery({
  inputValidation: getSignedUrlSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'document.getSignedUrl',
    target: 'Document',
    targetId: ({ input }) => input.key,
    action: UserActivityType.VIEW
  }
})
