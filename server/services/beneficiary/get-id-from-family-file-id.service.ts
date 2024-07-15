import { prismaClient } from '~/server/prisma'

export async function getIdFromFamilyFileId(familyFileId: string) {
  const beneficiaries = await prismaClient.beneficiary.findMany({
    where: {
      familyFileId
    },
    select: {
      id: true
    }
  })
  if (beneficiaries.length === 0) {
    throw createError({
      statusCode: 400,
      message: `no beneficiary for familyFileId ${familyFileId}`
    })
  }
  if (beneficiaries.length > 1) {
    throw createError({
      statusCode: 400,
      message: `more than one beneficiaries for familyFileId ${familyFileId}`
    })
  }
  return beneficiaries[0].id
}
