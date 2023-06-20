import {
  DeleteDocumentInput,
  EditDocumentInput,
  CreateViewUrlInput
} from '~/server/schema'
import {
  ProtectedAppContext,
  forbiddenError,
  invalidError,
  notfoundError
} from '~/server/trpc'
import {
  canDeleteDocument,
  canEditDocument,
  canViewDocument
} from '~/server/security/rules'
import { createSignedGetUrl, deleteUploadedFile } from '~/server/lib/s3'
import {
  getBeneficiarySecurityTarget,
  beneficiarySecurityTargetInclude
} from '~/server/security'
import { prismaClient } from '~/server/prisma'

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

  const updatedDocument = await prismaClient.document.update({
    where: { key },
    data: {
      ...data
    },
    include: { beneficiary: { select: { id: true, structureId: true } } }
  })

  return { document: updatedDocument }
}

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
}

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

  return { url }
}
