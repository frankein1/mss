import { SCHEDULER_ENV } from '../env'
import { performance } from 'node:perf_hooks'
import { initSentry, terminateSentry } from '../utils'
import { prismaClient } from '~/server/prisma'
import * as Sentry from '@sentry/node'
import { uploadWithEncryption } from '~/server/lib/s3/file'
import {
  generateFilenameForDocument,
  generateFileRootForDocument
} from '~/server/lib/s3/helper'

/** WARNING!
 * This migration must be launched in a detached one-off container using
 * the Scalingo CLI or the Scalingo API.
 * As a result importing this function is equivalent to launching the migration.
 */
async function main() {
  if (!SCHEDULER_ENV.document.migration.activate) {
    throw new Error('migrate-to-s3-bucket: document migration is not activated')
  }

  const sentryActivated = initSentry()
  if (sentryActivated) {
    Sentry.setTag('scheduler', 'migrate-to-s3-bucket')
  }

  const maxDuration = SCHEDULER_ENV.document.migration.maxDurationHours
  const logEvery = 100
  const deadline = Date.now() + maxDuration * 3600 * 1000
  let iteration = 0
  let duration: number | undefined = undefined

  console.log(
    `migrate-to-s3-bucket: starting migration for ${maxDuration} hours`
  )
  const start = performance.now()

  while (Date.now() < deadline) {
    let doc: DocumentToMigrate[]

    try {
      doc = await getDocumentToMigrate()
    } catch (e: unknown) {
      console.error(`migrate-to-s3-bucket: error fetching document`, e)
      if (sentryActivated) {
        Sentry.captureException(e)
      }
      continue
    }

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
      if (sentryActivated) {
        Sentry.captureException(e)
      }
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
    `migrate-to-s3-bucket: ${iteration} documents migrated in ${duration} s`
  )
}

async function getDocumentToMigrate() {
  return await prismaClient.document.findMany({
    where: {
      migrated: false
    },
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
 * Document content cleaunup will be performed when the whole migration has been finalized
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

/** Job Execution in one-off container.
 * The container will be stopped at the end of the job or upon error.
 * Cleanup allows to close sentry and prisma connections
 */

async function cleanup() {
  await terminateSentry()
  await prismaClient.$disconnect()
}

;['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal =>
  process.on(signal, async () => {
    await cleanup()
    process.exit(1)
  })
)

main().finally(cleanup)
