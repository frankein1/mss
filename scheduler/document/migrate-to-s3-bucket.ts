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

function parseFetchBatchSize(): number {
  const value = parseInt(
    process.env.NUXT_DOCUMENT_MIGRATION_FETCH_BATCH_SIZE || '500',
    10
  )
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(
      'NUXT_DOCUMENT_MIGRATION_FETCH_BATCH_SIZE must be a positive integer'
    )
  }
  return value
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
  fetchBatchSize: parseFetchBatchSize(),
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

// The document content will be fetched separately
//
// Selecting `documentContent.content` forced Prisma (relationJoins is enabled)
// to inline a LATERAL join whose JSONB projection sits in the SELECT list. That
// made PostgreSQL detoast and JSON-encode the file bytes of every candidate row
// before applying LIMIT, so a query returning a handful of rows touched the
// content of the whole unmigrated set. Content is now fetched one chunk at a
// time, in a single IN query, right before upload — see fetchChunkContents.
//
// No ORDER BY: a full drain needs no stable order (the migrated flag drops
// processed rows out of the filter and the notIn excludes failures), so we
// avoid sorting the unmigrated set on every batch and need no extra index.
function queryDocumentMetadata(batchSize: number, excludeKeys: string[]) {
  return prismaClient.document.findMany({
    where: queryFilter(excludeKeys),
    take: batchSize,
    select: {
      key: true,
      size: true
    }
  })
}
type DocumentToMigrate = Awaited<ReturnType<typeof queryDocumentMetadata>>[0]

async function fetchDocumentBatch(excludeKeys: string[]) {
  const start = performance.now()
  const docs = await queryDocumentMetadata(
    LOCAL_ENV.fetchBatchSize,
    excludeKeys
  )
  console.debug(
    `migrate-to-s3-bucket: fetched ${docs.length} document metadata rows in ${performance.now() - start} ms`
  )
  return docs
}

// Batch fetch for document content. A chunk holds at most uploadConcurrency blobs.
async function fetchChunkContents(
  keys: string[]
): Promise<Map<string, Buffer>> {
  const rows = await prismaClient.documentContent.findMany({
    where: { documentKey: { in: keys } },
    select: { documentKey: true, content: true }
  })
  const contents = new Map<string, Buffer>()
  for (const row of rows) {
    if (row.content) {
      contents.set(row.documentKey, row.content as Buffer)
    }
  }
  return contents
}

async function migrateDocument(doc: DocumentToMigrate, content: Buffer) {
  const bucketKey = generateBucketKeyForDocument(doc.key)

  const { encryptedDataKey } = await uploadWithEncryption({
    config: SCHEDULER_ENV,
    bucketKey,
    plainData: content as Buffer<ArrayBufferLike>,
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
  const failedIds: FailedId[] = []

  console.log(
    `migrate-to-s3-bucket: starting migration for ${LOCAL_ENV.maxDurationHours} hours`
  )
  const start = performance.now()

  async function worker(
    doc: DocumentToMigrate,
    content: Buffer | undefined,
    failedIds: FailedId[]
  ) {
    try {
      if (!content) {
        throw new Error(
          'migrate-to-s3-bucket: no content in document ' + doc.key
        )
      }
      await migrateDocument(doc, content)
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

  // Processes a batch in chunks of `uploadConcurrency`. Each chunk does exactly
  // one DB read (all its content in a single IN query) and then uploads its
  // documents in parallel — S3/KMS work that never touches the DB pool. So DB
  // read concurrency is capped at one connection while S3 upload concurrency is
  // uploadConcurrency. Checks the deadline and failure circuit-breaker between
  // chunks so a large batch stops promptly.
  async function drainBatch(docs: DocumentToMigrate[]) {
    const chunkSize = LOCAL_ENV.uploadConcurrency
    for (let i = 0; i < docs.length; i += chunkSize) {
      if (Date.now() >= deadline || failedIds.length >= 100) {
        return
      }
      const chunk = docs.slice(i, i + chunkSize)
      const contents = await fetchChunkContents(chunk.map(doc => doc.key))
      await Promise.all(
        chunk.map(doc => worker(doc, contents.get(doc.key), failedIds))
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

    await drainBatch(docs)
  }

  const duration = (performance.now() - start) / 1000
  failedIds.forEach(f =>
    console.log(`migrate-to-s3-bucket:  error ${f.key}: ${f.error}`)
  )
  console.log(
    `migrate-to-s3-bucket: ${nMigrated} documents migrated, ${sizeMigrated / 1_000_000} MB migrated in ${duration} s, ${failedIds.length} failed migrations`
  )
}
