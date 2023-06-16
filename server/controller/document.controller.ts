import {
  DeleteDocumentInput,
  EditDocumentInput,
  CreateViewUrlInput
} from '../schema'
import {
  AppContext,
  forbiddenError,
  invalidError,
  notfoundError
} from '../trpc'
import {
  canDeleteBeneficiaryDocument,
  canEditBeneficiaryDocument,
  canViewBeneficiaryDocuments
} from '../query/security/rules'
import { createSignedGetUrl, deleteUploadedFile } from '../lib/s3'
import {
  getBeneficiarySecurityTarget,
  beneficiarySecurityTargetInclude
} from '../query'
import { prismaClient } from '~/server/prisma'

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
