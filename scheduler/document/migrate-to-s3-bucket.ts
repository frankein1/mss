/* eslint-disable no-console */
import type { Prisma } from '@prisma/client'
import { generateBucketKeyForDocument } from '~~/server/lib/s3/helper'
import { SCHEDULER_ENV } from '../env'
import { uploadWithEncryption } from '~~/server/lib/s3/file'
import { prismaClient } from '~~/server/prisma'

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

function parseMaxDuration() {
  const maxDurationHours = parseFloat(
    process.env.NUXT_DOCUMENT_MIGRATION_MAX_DURATION_HOURS || '3'
  )
  if (!Number.isFinite(maxDurationHours) || maxDurationHours < 0) {
    throw new Error(
      'NUXT_DOCUMENT_MIGRATION_MAX_DURATION_HOURS must be finite and positive'
    )
  }

  return maxDurationHours
}

function parseDocumentSizeLimit() {
  if (!hasDocumentSizeLimit()) {
    return undefined
  }
  const documentSizeLimit = parseFloat(
    process.env.NUXT_DOCUMENT_MIGRATION_SIZE_LIMIT || '2000000' // default 2Mb
  )
  if (!Number.isFinite(documentSizeLimit) || documentSizeLimit < 0) {
    throw new Error(
      'NUXT_DOCUMENT_MIGRATION_SIZE_LIMIT must be finite and positive'
    )
  }

  return documentSizeLimit
}

function hasDocumentSizeLimit() {
  const value = process.env.NUXT_DOCUMENT_HAS_DOCUMENT_SIZE_LIMIT
  if (value == undefined) {
    return false
  }
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  throw new Error(
    'NUXT_DOCUMENT_HAS_DOCUMENT_SIZE_LIMIT must be "true" or "false"'
  )
}

function parseDryRun() {
  const value = process.env.NUXT_DOCUMENT_MIGRATION_DRY_RUN
  if (value == undefined) {
    return true // default is a dry run
  }
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  throw new Error('NUXT_DOCUMENT_MIGRATION_DRY_RUN must be "true" or "false"')
}

const LOCAL_ENV = {
  maxDurationHours: parseMaxDuration(),
  hasDocumentSizeLimit: hasDocumentSizeLimit(),
  documentSizeLimit: parseDocumentSizeLimit(),
  uploadConcurrency: parseUploadConcurrency(),
  dryRun: parseDryRun()
}

function queryFilter(excludeKeys: string[] = []): Prisma.DocumentWhereInput {
  return {
    migrated: false,
    ...(excludeKeys.length > 0 && { key: { notIn: excludeKeys } }),
    ...(LOCAL_ENV.hasDocumentSizeLimit && {
      size: { gt: 0, lt: LOCAL_ENV.documentSizeLimit }
    })
  }
}

function query(batchSize: number, excludeKeys: string[]) {
  return prismaClient.document.findMany({
    where: queryFilter(excludeKeys),
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

  // DocumentContent rows are kept intentionally — cleaned up in a separate pass after migration is verified.
  //
  // The uploaded S3 object is intentionally not cleaned up if this update fails.
  // The update can throw after PostgreSQL has already committed it (e.g. a
  // connection reset): the row would then be migrated:true and download reads
  // from S3, so deleting the object would break an already-migrated document.
  // Leaving it is safe — the bucket key is deterministic, so a genuinely failed
  // (still migrated:false) document is overwritten on retry, and download never
  // reads S3 for a migrated:false row. A throw here is caught by the worker,
  // which records the failure and continues; it does not stop the job.
  await prismaClient.document.update({
    select: { key: true },
    where: { key: doc.key },
    data: {
      migrated: true,
      encryptedDataKey,
      filenameDisk: bucketKey
    }
  })
}

// Reports the scope of a real run without touching S3 or the database.
// Uses aggregate queries over the same filter as the migration, so it never
// enters the batch loop (the loop only advances because migrated rows drop out
// of the filter — nothing does in a read-only pass).
async function dryRunReport() {
  const where = queryFilter()
  const start = performance.now()
  const [count, aggregate] = await Promise.all([
    prismaClient.document.count({ where }),
    prismaClient.document.aggregate({ where, _sum: { size: true } })
  ])
  const totalSize = aggregate._sum.size ?? 0
  const duration = (performance.now() - start) / 1000

  console.log(
    'migrate-to-s3-bucket: ===== DRY RUN — no document will be modified ====='
  )
  console.log(
    `migrate-to-s3-bucket: size limit ${
      LOCAL_ENV.hasDocumentSizeLimit
        ? `enabled (0 < size < ${LOCAL_ENV.documentSizeLimit} bytes)`
        : 'disabled'
    }`
  )
  console.log(
    `migrate-to-s3-bucket: ${count} documents would be migrated (${(totalSize / 1_000_000).toFixed(1)} MB), computed in ${duration.toFixed(3)} s`
  )
}

export default async function migrateToS3Bucket() {
  console.log('migrate-to-s3-bucket: environment configuration', LOCAL_ENV)

  if (LOCAL_ENV.dryRun) {
    await dryRunReport()
    return
  }

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
    sizeMigrated += doc.size ?? 0
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
