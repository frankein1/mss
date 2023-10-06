import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { DeleteDocumentInput, deleteDocumentSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { beneficiarySecurityTargetInclude } from '~/server/security'
import { SecurityRuleGrantee, canDeleteDocument } from '~/server/security/rules'
import { deleteUploadedFile } from '~/server/lib/s3'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: DeleteDocumentInput
) => {
  const document = await prismaClient.document.findUniqueOrThrow({
    where: { key: input.documentKey },
    include: { beneficiary: beneficiarySecurityTargetInclude }
  })

  return canDeleteDocument(user, document.beneficiary)
}

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: DeleteDocumentInput
}) => {
  const { documentKey } = input

  const document = await prismaClient.document.findUniqueOrThrow({
    where: { key: documentKey },
    include: { beneficiary: beneficiarySecurityTargetInclude }
  })

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

export const deleteDocumentMutation = createMutation({
  inputValidation: deleteDocumentSchema,
  handler,
  securityCheck
})
