/* eslint-disable no-console */
import { generateBucketKeyForDocument } from '~/server/lib/s3/helper'
import { SCHEDULER_ENV } from '../env'
import { deleteFile, uploadWithEncryption } from '~/server/lib/s3/file'
import { prismaClient } from '~/server/prisma'

type FailedId = { key: string; error: string }

const ALLOWED_CONCURRENCIES = [5, 10, 20] as const
const LOG_EVERY_N = 100

function parseUploadConcurrency(): number {
  const value = parseInt(
    process.env.NUXT_DOCUMENT_UPLOAD_CONCURRENCY || '5',
    10
  )
  if (
    !ALLOWED_CONCURRENCIES.includes(
      value as (typeof ALLOWED_CONCURRENCIES)[number]
    )
  ) {
    throw new Error(
      `NUXT_DOCUMENT_UPLOAD_CONCURRENCY must be one of ${ALLOWED_CONCURRENCIES.join(', ')}, got ${value}`
    )
  }
  return value
}

const LOCAL_ENV = {
  maxDurationHours: parseFloat(
    process.env.NUXT_DOCUMENT_MIGRATION_MAX_DURATION_HOURS || '3'
  ),
  hasDocumentSizeLimit:
    (process.env.NUXT_DOCUMENT_HAS_DOCUMENT_SIZE_LIMIT || 'true') === 'true',
  uploadConcurrency: parseUploadConcurrency()
}

function query(batchSize: number, excludeKeys: string[]) {
  return prismaClient.document.findMany({
    where: {
      migrated: false,
      ...(excludeKeys.length > 0 && { key: { notIn: excludeKeys } }),
      ...(LOCAL_ENV.hasDocumentSizeLimit && {
        size: { gt: 0, lt: 2_000_000 }
      })
    },
    orderBy: [{ created: 'asc' }, { key: 'asc' }],
    skip: 0,
    take: batchSize,
    select: {
      key: true,
      size: true,
      documentContent: { select: { content: true } }
    }
  })
}
type DocumentToMigrate = Awaited<ReturnType<typeof query>>[0]

async function fetchDocumentBatch(excludeKeys: string[]) {
  const start = performance.now()
  const docs = await query(LOCAL_ENV.uploadConcurrency, excludeKeys)
  console.debug(
    `migrate-to-s3-bucket: fetching ${LOCAL_ENV.uploadConcurrency} documents in ${performance.now() - start} ms`
  )
  return docs
}

async function migrateDocument(doc: DocumentToMigrate) {
  const bucketKey = generateBucketKeyForDocument(doc.key)

  if (!doc.documentContent?.content) {
    throw new Error('migrate-to-s3-bucket: no content in document ' + doc.key)
  }

  const { encryptedDataKey } = await uploadWithEncryption({
    config: SCHEDULER_ENV,
    bucketKey,
    plainData: doc.documentContent.content as Buffer<ArrayBufferLike>,
    dataForEncryptionContext: { documentKey: doc.key }
  })

  try {
    await prismaClient.document.update({
      select: { key: true },
      where: { key: doc.key },
      data: {
        migrated: true,
        encryptedDataKey,
        filenameDisk: bucketKey
      }
    })
  } catch (e: unknown) {
    // If storing the document data in DB fails the document content won't be readable
    // So it is cleaned and an error is sent.
    await deleteFile(SCHEDULER_ENV, bucketKey).catch(s3e =>
      console.error(
        `migrate-to-s3-bucket: cleanup failed for ${bucketKey}`,
        s3e
      )
    )
    throw e
  }
}

export default async function migrateToS3Bucket() {
  const deadline = Date.now() + LOCAL_ENV.maxDurationHours * 3600 * 1000

  let sizeMigrated = 0
  let nMigrated = 0
  let duration: number | undefined = undefined
  const failedIds: FailedId[] = []

  console.log(
    `migrate-to-s3-bucket: starting migration for ${LOCAL_ENV.maxDurationHours} hours`
  )
  const start = performance.now()

  async function worker(doc: DocumentToMigrate, failedIds: FailedId[]) {
    try {
      await migrateDocument(doc)
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : String(e)
      failedIds.push({ key: doc.key, error })
      return
    }

    nMigrated++
    sizeMigrated += doc.size || 0
    if (nMigrated % LOG_EVERY_N === 0) {
      console.log(
        `migrate-to-s3-bucket: ${nMigrated} documents migrated so far (${(sizeMigrated / 1_000_000).toFixed(1)} MB)`
      )
    }
  }

  while (Date.now() < deadline && failedIds.length < 100) {
    const docs = await fetchDocumentBatch(failedIds.map(f => f.key))
    if (!docs.length) {
      console.log(
        `migrate-to-s3-bucket: no documents available to migrate, job stopping`
      )
      break
    }

    await Promise.all(docs.map(doc => worker(doc, failedIds)))
  }

  duration = (performance.now() - start) / 1000
  failedIds.forEach(f =>
    console.log(`migrate-to-s3-bucket:  error ${f.key}: ${f.error}`)
  )
  console.log(
    `migrate-to-s3-bucket: ${nMigrated} documents migrated, ${sizeMigrated / 1_000_000} MB migrated in ${duration} s, ${failedIds.length} failed migrations`
  )
}
