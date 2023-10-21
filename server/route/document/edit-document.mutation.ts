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
} from '~/server/security/rules'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError
} from '~/server/trpc'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
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

  if (!beneficiary) {
    throw invalidError()
  }

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

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Document',
    objectId: key
  })

  return { document: updatedDocument }
}

export const editDocumentMutation = createMutation({
  inputValidation: editDocumentSchema,
  securityCheck,
  handler
})
