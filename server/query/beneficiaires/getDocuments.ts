import { prismaClient } from '~/server/prisma'

export function getDocuments({
  beneficiaryId
}: {
  userId: string
  beneficiaryId: string
}) {
  return prismaClient.document.findMany({
    where: { beneficiaryId }
  })
}
