import { prismaClient } from '~/server/prisma'
import { deleteFilesByKeys } from '~/server/lib/s3/file'
import type { AppConfig } from '~/types/appConfig'

type S3Config = Pick<AppConfig, 'document' | 's3' | 'public'>

async function getMigratedFileKeys(where: {
  beneficiaryId?: string
  structureId?: string
}) {
  // Not acceptable to not use DocumentRepo!
  const documents = await prismaClient.document.findMany({
    where: {
      migrated: true,
      ...(where.beneficiaryId && { beneficiaryId: where.beneficiaryId }),
      ...(where.structureId && {
        beneficiary: { structureId: where.structureId }
      })
    },
    select: { filenameDisk: true }
  })
  return documents.map(d => d.filenameDisk)
}

export async function deleteBeneficiaryS3Files(
  config: S3Config,
  beneficiaryId: string
) {
  const keys = await getMigratedFileKeys({ beneficiaryId })
  await deleteFilesByKeys(config, keys)
}

export async function deleteStructureS3Files(
  config: S3Config,
  structureId: string
) {
  const keys = await getMigratedFileKeys({ structureId })
  await deleteFilesByKeys(config, keys)
}
