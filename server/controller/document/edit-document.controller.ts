import { UserActivityType } from '@prisma/client'
import { EditDocumentInput } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/security'
import {
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
  return prismaClient.document.findUnique({
    where: { key },
    select: {
      createdById: true,
      confidential: true
    }
  })
}

export const editDocumentHandler = async ({
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

  if (!document) {
    throw invalidError()
  }

  if (!canEditDocument(user, beneficiary, document)) {
    throw forbiddenError()
  }

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
