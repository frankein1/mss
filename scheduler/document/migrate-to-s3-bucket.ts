import { SCHEDULER_ENV } from '../env'
import { performance } from 'node:perf_hooks'
import { prismaClient } from '~/server/prisma'
import * as Sentry from '@sentry/node'
import { uploadWithEncryption } from '~/server/lib/s3/file'
import {
  generateFilenameForDocument,
  generateFileRootForDocument
} from '~/server/lib/s3/helper'

export default async function migrateDocumentsToS3() {
  if (!SCHEDULER_ENV.document.migration.activate) {
    throw new Error('migrate-to-s3-bucket: document migration is not activated')
  }

  Sentry.setTag('scheduler', 'migrate-to-s3-bucket')

  const maxDuration = SCHEDULER_ENV.document.migration.maxDurationHours
  const logEvery = 100
  const deadline = Date.now() + maxDuration * 3600 * 1000
  let iteration = 0
  let duration: number | undefined = undefined

  console.log(
    `migrate-to-s3-bucket: starting migration for ${maxDuration} hours`
  )
  const start = performance.now()

  const failedIds: string[] = []

  while (Date.now() < deadline) {
    const doc = await getDocumentToMigrate(failedIds)

    if (!doc[0]) {
      break
    }

    const document = doc[0]

    try {
      await migrateDocument(document)
    } catch (e: unknown) {
      console.error(
        `migrate-to-s3-bucket: error for document ${document.key} "${document.name}"`,
        e
      )
      failedIds.push(document.key)
      Sentry.captureException(e)
      continue
    }

    iteration++
    if (iteration % logEvery === 0) {
      duration = (performance.now() - start) / 1000
      console.log(
        `migrate-to-s3-bucket: ${iteration} documents migrated in ${duration} s`
      )
    }
  }

  duration = (performance.now() - start) / 1000
  console.log(
    `migrate-to-s3-bucket: ${iteration} documents migrated in ${duration} s, ${failedIds.length} failed migrations`
  )
}

async function getDocumentToMigrate(notIn: string[]) {
  return await prismaClient.document.findMany({
    // a temporary index should be added on migrated
    // otherwise the request will become slower as the migration progresses
    where: { migrated: false, key: { notIn } },
    select: {
      key: true,
      name: true,
      mimeType: true,
      size: true,
      filenameDisk: true,
      beneficiary: {
        select: {
          id: true,
          structureId: true
        }
      },
      documentContent: {
        select: {
          content: true
        }
      }
    },
    take: 1
  })
}

type DocumentToMigrate = Awaited<ReturnType<typeof getDocumentToMigrate>>[0]

/** Document content is migrated to S3 bucket and filepath is updated in table
 * Document content cleanup will be performed when the whole migration has been finalized
 */
async function migrateDocument(document: DocumentToMigrate) {
  const filename = generateFilenameForDocument(document.name)
  const filepath = `${generateFileRootForDocument(document.beneficiary.structureId, document.beneficiary.id)}/${filename}`

  if (!document.documentContent) {
    throw new Error(
      `migrate-to-s3-bucket: missing document content for key ${document.key}`
    )
  }
  if (!document.size) {
    throw new Error(
      `migrate-to-s3-bucket: missing document size for key ${document.key}`
    )
  }

  await uploadWithEncryption({
    config: SCHEDULER_ENV,
    bucketKey: filepath,
    plainData: Buffer.from(document.documentContent.content),
    dataForEncryptionContext: {
      documentKey: document.key,
      contentType: document.mimeType,
      contentLength: document.size
    }
  })

  await prismaClient.document.update({
    select: { key: true },
    where: { key: document.key },
    data: {
      migrated: true,
      filenameDisk: filepath,
      filenameDownload: filename
    }
  })
}
