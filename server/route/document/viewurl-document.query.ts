import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { CreateViewUrlInput, createViewUrlSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { beneficiarySecurityTargetInclude } from '~/server/query'
import { SecurityRuleGrantee, canViewDocument } from '~/server/security'
import { createSignedGetUrl, createContentUrl } from '~/server/lib/s3'
import { DocumentRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: CreateViewUrlInput
) => {
  const { key } = input
  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    include: { beneficiary: beneficiarySecurityTargetInclude }
  })

  return canViewDocument(user, document.beneficiary, document)
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
    where: { key }
  })

  const { s3 } = useRuntimeConfig()

  const { url } = await createSignedGetUrl({
    key: document.filenameDisk,
    bucket: s3.bucket
  })

  const { url: downloadUrl } = await createContentUrl({
    key: document.filenameDisk,
    bucket: s3.bucket
  })

  return {
    url,
    downloadUrl
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
