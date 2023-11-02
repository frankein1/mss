import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { DeleteDocumentInput, deleteDocumentSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { beneficiarySecurityTargetInclude } from '~/server/query'
import { SecurityRuleGrantee, canDeleteDocument } from '~/server/security/rules'
import { deleteUploadedFile } from '~/server/lib/s3'
import { DocumentRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: DeleteDocumentInput
) => {
  const document = await DocumentRepo.findUniqueOrThrow(user, {
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

  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key: documentKey },
    include: { beneficiary: beneficiarySecurityTargetInclude }
  })

  await deleteUploadedFile({ key: document.filenameDisk }).catch(error => {
    throw error
  })

  await DocumentRepo.prisma.delete({
    where: { key: documentKey }
  })
}

export const deleteDocumentMutation = createMutation({
  inputValidation: deleteDocumentSchema,
  handler,
  securityCheck,
  auditLog: {
    key: 'document.delete',
    target: 'Document',
    targetId: ({ input }) => {
      return input.documentKey
    },
    action: UserActivityType.DELETE
  }
})
