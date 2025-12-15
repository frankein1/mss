import { DocumentRepo } from '~/server/database'
import { deleteFile } from '~/server/lib/s3/file'
import type { SecurityRuleContext } from '~/server/security'

export async function deleteDocument({
  user,
  key
}: {
  user: SecurityRuleContext['user']
  key: string
}) {
  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    select: { filenameDisk: true, migrated: true }
  })

  // If document has been migrated, delete file from S3 and from DB
  if (document.migrated) {
    const config = useRuntimeConfig()

    await deleteFile(config.s3, document.filenameDisk)
    return await DocumentRepo.prisma.delete({
      select: { key: true },
      where: { key }
    })
  }

  // Else, delete from DB with cascade to delete content
  return await DocumentRepo.prisma.delete({
    select: { key: true },
    where: { key }
  })
}
