import { defineEventHandler } from 'h3'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { prismaClient } from '~/server/prisma'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const { exec } = await readBody(event)
  if (!exec) {
    throw forbiddenError()
  }

  const draftBeneficiaries = await prismaClient.beneficiary.findMany({
    where: {
      draft: true,
      socialSupports: { none: {} }
    },
    select: {
      id: true,
      familyFileId: true,
      familyFile: {
        select: { beneficiaries: true }
      }
    }
  })

  const beneficiariesToDelete = draftBeneficiaries.map(b => b.id)
  const familyFilesToDelete = draftBeneficiaries.map(b => {
    if (b.familyFile?.beneficiaries?.length === 1) {
      return b.familyFileId
    }
  })

  const deleteBeneficiaries = () =>
    prismaClient.beneficiary.deleteMany({
      where: { id: { in: beneficiariesToDelete } }
    })
  const deleteFamilyFiles = () =>
    prismaClient.familyFile.deleteMany({
      where: { id: { in: familyFilesToDelete.filter(ff => ff != null) } }
    })

  const [beneficiariesDeleted, familyFilesDeleted] =
    await prismaClient.$transaction([
      deleteBeneficiaries(),
      deleteFamilyFiles()
    ])

  return {
    updatedCount: beneficiariesDeleted.count
  }
})
