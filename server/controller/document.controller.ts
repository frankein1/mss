import {
  AddDocumentInput,
  DeleteDocumentInput,
  EditDocumentInput,
  CreateUploadUrlInput,
  CreateViewUrlInput
} from '../schema'
import {
  AppContext,
  forbiddenError,
  invalidError,
  notfoundError
} from '../trpc'
import {
  canAddBeneficiaryDocument,
  canDeleteBeneficiaryDocument,
  canEditBeneficiaryDocument,
  canViewBeneficiaryDocuments
} from '../query/security/rules'
import {
  createSignedGetUrl,
  createSignedUploadUrl,
  deleteUploadedFile
} from '../lib/s3'
import {
  getBeneficiarySecurityTarget,
  beneficiarySecurityTargetInclude
} from '../query'
import { prismaClient } from '~/server/prisma'

export const addDocumentHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: AddDocumentInput
}) => {
  const { type, beneficiaryId, confidential, tags, file } = input
  const document = await prismaClient.document.create({
    data: {
      key: file.key,
      name: file.name,
      filenameDisk: file.key,
      beneficiaryId,
      mimeType: file.mimeType,
      confidential,
      tags,
      createdById: user.id,
      type
    },
    include: {
      beneficiary: {
        select: {
          id: true,
          structureId: true,
          fileNumber: true
        }
      }
    }
  })

  return { document }
}

export const editDocumentHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: EditDocumentInput
}) => {
  const { key, beneficiaryId, ...data } = input

  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary) {
    throw invalidError()
  }

  if (!canEditBeneficiaryDocument(user, beneficiary)) {
    throw forbiddenError()
  }

  const document = await prismaClient.document.update({
    where: { key },
    data: {
      ...data
    },
    include: { beneficiary: { select: { id: true, structureId: true } } }
  })

  return { document }
}

export const deleteDocumentHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
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

  if (!canDeleteBeneficiaryDocument(user, document.beneficiary)) {
    throw forbiddenError()
  }

  await prismaClient.document.delete({
    where: { key: documentKey },
    include: {
      beneficiary: {
        select: { id: true, structureId: true }
      }
    }
  })
  deleteUploadedFile({ key: documentKey }).catch(error => {
    // Sentry.captureException(error, { tags: { sensitive: true } })
    throw error
  })
}

export const createUploadUrlHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
  input: CreateUploadUrlInput
}) => {
  const { beneficiaryId, name, mimeType } = input
  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary) {
    throw invalidError()
  }

  if (!canAddBeneficiaryDocument(user, beneficiary)) {
    throw forbiddenError()
  }

  const directory = `users/${user.id}/uploaded-documents`

  const { s3 } = useRuntimeConfig()

  const { url, key } = await createSignedUploadUrl({
    name,
    type: mimeType,
    directory,
    bucket: s3.bucket
  })

  return { url, key }
}

export const createViewUrlHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AppContext
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
  if (!canViewBeneficiaryDocuments(user, document.beneficiary)) {
    throw forbiddenError()
  }

  const { s3 } = useRuntimeConfig()

  const { url } = await createSignedGetUrl({
    key: document.filenameDisk,
    bucket: s3.bucket
  })

  return { url }
}
