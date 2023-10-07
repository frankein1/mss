import { UserActivityType } from '@prisma/client'
import { CreateViewUrlInput } from '~/server/schema'
import {
  ProtectedAppContext,
  forbiddenError,
  notfoundError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { beneficiarySecurityTargetInclude } from '~/server/security'
import { canViewDocument } from '~/server/security/rules'
import { createSignedGetUrl } from '~/server/lib/s3'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const createViewUrlHandler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: CreateViewUrlInput
}) => {
  const { key } = input
  const document = await prismaClient.document.findUnique({
    where: { key },
    include: { beneficiary: beneficiarySecurityTargetInclude }
  })

  if (!document) {
    throw notfoundError()
  }
  if (!canViewDocument(user, document.beneficiary, document)) {
    throw forbiddenError()
  }

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
