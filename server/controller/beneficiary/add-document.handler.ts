import { v4 } from 'uuid'
import { prismaClient } from '~/server/prisma'
import { AppContext } from '~/server/trpc'
import { AddDocumentInput } from '~/server/schema'

export const addDocumentHandler = async ({
  input,
  ctx: { user }
}: {
  input: AddDocumentInput
  ctx: AppContext
}) => {
  const { beneficiaryId, type, tags, confidential, file } = input
  return await prismaClient.document.create({
    data: {
      key: v4(),
      mimeType: file.mimeType,
      name: file.name,
      type,
      size: file.size,
      tags,
      confidential,
      beneficiaryId,
      createdById: user.id
    }
  })
}
