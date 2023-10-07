import { UserActivityType } from '@prisma/client'
import { DeleteDocumentInput } from '~/server/schema'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { beneficiarySecurityTargetInclude } from '~/server/security'
import { canDeleteDocument } from '~/server/security/rules'
import { deleteUploadedFile } from '~/server/lib/s3'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const deleteDocumentHandler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: DeleteDocumentInput
}) => {
  const { documentKey } = input

  const document = await prismaClient.document.findUnique({
    where: { key: documentKey },
    include: { beneficiary: beneficiarySecurityTargetInclude }
  })

  if (!document) {
    throw invalidError()
  }

  if (!canDeleteDocument(user, document.beneficiary)) {
    throw forbiddenError()
  }

  await deleteUploadedFile({ key: document.filenameDisk }).catch(error => {
    throw error
  })

  await prismaClient.document.delete({
    where: { key: documentKey }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'Document',
    objectId: documentKey
  })
}
