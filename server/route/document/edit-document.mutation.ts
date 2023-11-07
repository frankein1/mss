import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { EditDocumentInput, editDocumentSchema } from '~/server/schema'
import {
  getBeneficiarySecurityTarget,
  getDocumentSecurityTarget
} from '~/server/query'
import {
  SecurityRuleGrantee,
  canEditDocument,
  canSetDocumentAsConfidential
} from '~/server/security'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { DocumentRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditDocumentInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )
  const document = await getDocumentSecurityTarget(user, input.key)
  return canEditDocument(user, beneficiary, document)
}

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: EditDocumentInput
}) => {
  const { key, beneficiaryId, ...data } = input

  const beneficiary = await getBeneficiarySecurityTarget(user, beneficiaryId)

  const document = await getDocumentSecurityTarget(user, key)

  if (
    data.confidential !== document.confidential &&
    !canSetDocumentAsConfidential(user, beneficiary, document)
  ) {
    throw forbiddenError()
  }

  const updatedDocument = await DocumentRepo.prisma.update({
    where: { key },
    data,
    include: { beneficiary: { select: { id: true, structureId: true } } }
  })

  return { document: updatedDocument }
}

export const editDocumentMutation = createMutation({
  inputValidation: editDocumentSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'document.update',
    target: 'Document',
    targetId: ({ input }) => {
      return input.key
    },
    action: UserActivityType.UPDATE
  }
})
