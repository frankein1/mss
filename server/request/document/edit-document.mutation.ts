import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/request'
import { EditDocumentInput, editDocumentSchema } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/security'
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
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

function getDocumentSecurityTarget(key: string) {
  return prismaClient.document.findUniqueOrThrow({
    where: { key },
    select: {
      createdById: true,
      confidential: true
    }
  })
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditDocumentInput
) => {
  const beneficiary = await getBeneficiarySecurityTarget(input.beneficiaryId)
  const document = await getDocumentSecurityTarget(input.key)
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

  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary) {
    throw invalidError()
  }

  const document = await getDocumentSecurityTarget(key)

  if (
    data.confidential !== document.confidential &&
    !canSetDocumentAsConfidential(user, beneficiary, document)
  ) {
    throw forbiddenError()
  }

  const updatedDocument = await prismaClient.document.update({
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
