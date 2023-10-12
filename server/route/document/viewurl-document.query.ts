import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { CreateViewUrlInput, createViewUrlSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { beneficiarySecurityTargetInclude } from '~/server/query'
import { SecurityRuleGrantee, canViewDocument } from '~/server/security/rules'
import { createSignedGetUrl } from '~/server/lib/s3'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { DocumentRepo } from '~/server/repository'

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

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.VIEW,
    object: 'Document',
    objectId: key
  })

  return { url }
}

export const createViewUrlMutation = createMutation({
  inputValidation: createViewUrlSchema,
  securityCheck,
  handler
})
