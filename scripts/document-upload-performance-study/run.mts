/* eslint-disable no-console */
import { parseArgs } from 'node:util'
import { randomUUID } from 'node:crypto'
import { AsyncLocalStorage } from 'node:async_hooks'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { Upload } from '@aws-sdk/lib-storage'
import type { KmsClient } from '~~/server/lib/encryption/adapters/kms-client'
// The server modules are authored as ESM but tsx emits them as CommonJS (no
// package.json `type: module`), so ESM named-import linking fails. Loading
// them via `await import()` returns the full CJS namespace instead.
const { getOpenBaoKeyManagerClient } = await import(
  '~~/server/lib/encryption/adapters/open-bao'
)
const { encrypt } = await import('~~/server/lib/encryption/encrypt')
const { getS3Client } = await import('~~/server/lib/s3/config')
const { generateBucketKeyForDocument } = await import('~~/server/lib/s3/helper')
const { deleteFiles } = await import('~~/server/lib/s3/file')

type AppConfig = {
  document: {
    useS3Storage: boolean
    encryptionVersion: string
    encryptionAlgorithm: string
  }
  s3: {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
    endpoint: string
    forcePathStyle: boolean
  }
  kms: {
    accessKeyId: string
    secretKey: string
    organizationId: string
    projectId: string
    region: string
    apiUrl: string
    keyId: string
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpSecure: boolean
    smtpUser: string
    smtpPassword: string
  }
  public: {
    mssEnvironment: string
    email: {
      from: string
    }
    sentry: {
      dsn: string | undefined
      debug: boolean
      tracesSampleRate: number
    }
    landingPageUrl: string
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
  options: {
    concurrency: { type: 'string' },
    total: { type: 'string', default: '100' },
    cleanup: { type: 'boolean', default: false }
  },
  strict: true
})

const concurrency = Number(args.concurrency)
const total = Number(args.total)
const cleanup = args.cleanup!

if (!concurrency || ![1, 5, 10, 20, 50].includes(concurrency)) {
  console.error('--concurrency is required and must be 1, 5, 10,20 or 50')
  process.exit(1)
}
if (!total || total < 1) {
  console.error('--total must be a positive integer')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

const REQUIRED_ENV = [
  'NUXT_S3_ACCESS_KEY_ID',
  'NUXT_S3_SECRET_ACCESS_KEY',
  'NUXT_S3_REGION',
  'NUXT_S3_BUCKET',
  'NUXT_S3_ENDPOINT'
] as const

const REQUIRED_KMS_ENV = [
  'NUXT_KMS_ACCESS_KEY_ID',
  'NUXT_KMS_SECRET_KEY',
  'NUXT_KMS_API_URL',
  'NUXT_KMS_KEY_ID'
] as const

const missing = [...REQUIRED_ENV, ...REQUIRED_KMS_ENV].filter(
  k => !process.env[k]
)
if (missing.length) {
  console.error(
    `Missing required environment variables:\n  ${missing.join('\n  ')}`
  )
  process.exit(1)
}

function env(key: string): string {
  return process.env[key]!
}

// ---------------------------------------------------------------------------
// Config objects matching production types
// ---------------------------------------------------------------------------

const kmsConfig = {
  kms: {
    accessKeyId: env('NUXT_KMS_ACCESS_KEY_ID'),
    secretKey: env('NUXT_KMS_SECRET_KEY'),
    organizationId: '',
    projectId: env('NUXT_KMS_PROJECT_ID') ?? '',
    region: '',
    apiUrl: env('NUXT_KMS_API_URL'),
    keyId: env('NUXT_KMS_KEY_ID')
  }
}

const s3Config: Pick<AppConfig, 's3' | 'public'> = {
  s3: {
    accessKeyId: env('NUXT_S3_ACCESS_KEY_ID'),
    secretAccessKey: env('NUXT_S3_SECRET_ACCESS_KEY'),
    region: env('NUXT_S3_REGION'),
    bucket: env('NUXT_S3_BUCKET'),
    endpoint: env('NUXT_S3_ENDPOINT'),
    forcePathStyle: env('NUXT_S3_FORCE_PATH_STYLE') === 'true'
  },
  public: {
    mssEnvironment: 'performance-study',
    email: { from: '' },
    sentry: { dsn: undefined, debug: false, tracesSampleRate: 0 },
    landingPageUrl: ''
  }
}

const encryptConfig = {
  ...kmsConfig,
  document: {
    useS3Storage: true,
    encryptionVersion: '1',
    encryptionAlgorithm: 'aes_256_gcm'
  }
}

const fullConfig: Pick<AppConfig, 'document' | 's3' | 'kms' | 'public'> = {
  ...encryptConfig,
  ...s3Config
}

// ---------------------------------------------------------------------------
// Sample files
// ---------------------------------------------------------------------------
const SAMPLES_DIR = join(import.meta.dirname, 'ignore/samples')

interface SampleFile {
  name: string
  data: Buffer
  sizeBytes: number
}

async function loadSamples(): Promise<SampleFile[]> {
  const entries = await readdir(SAMPLES_DIR)
  const files = entries.filter(f => /\.(pdf|png|jpg|jpeg|webp|gif)$/i.test(f))
  if (!files.length) {
    console.error(
      `No sample files found in ${SAMPLES_DIR}.\nPlace 5-10 PDF/image files (200KB-2MB) in that directory.`
    )
    process.exit(1)
  }
  const samples: SampleFile[] = []
  for (const name of files) {
    const data = await readFile(join(SAMPLES_DIR, name))
    samples.push({ name, data, sizeBytes: data.byteLength })
  }
  console.log(
    `Loaded ${samples.length} sample files (${samples.map(s => `${s.name}: ${(s.sizeBytes / 1024).toFixed(0)}KB`).join(', ')})`
  )
  return samples
}

// ---------------------------------------------------------------------------
// TimedKmsClient — monkey-patches the singleton returned by OpenBao adapter
// ---------------------------------------------------------------------------

interface UploadTiming {
  kmsMs: number
}

const timingStore = new AsyncLocalStorage<UploadTiming>()

async function patchKmsClientWithTiming(): Promise<KmsClient> {
  const realClient = await getOpenBaoKeyManagerClient(kmsConfig)
  const originalGenerateDataKey = realClient.generateDataKey.bind(realClient)

  realClient.generateDataKey = async (params: any) => {
    const start = performance.now()
    const result = await originalGenerateDataKey(params)
    const store = timingStore.getStore()
    if (store) {
      store.kmsMs = performance.now() - start
    }
    return result
  }

  return realClient
}

// ---------------------------------------------------------------------------
// CSV row
// ---------------------------------------------------------------------------

interface CsvRow {
  timestamp: string
  doc_index: number
  filename: string
  size_bytes: number
  concurrency: number
  kms_ms: number
  encrypt_ms: number
  upload_ms: number
  total_ms: number
  error_type: string
  error_message: string
}

const CSV_HEADER =
  'timestamp,doc_index,filename,size_bytes,concurrency,kms_ms,encrypt_ms,upload_ms,total_ms,error_type,error_message'

function csvLine(row: CsvRow): string {
  return [
    row.timestamp,
    row.doc_index,
    row.filename,
    row.size_bytes,
    row.concurrency,
    row.kms_ms.toFixed(1),
    row.encrypt_ms.toFixed(1),
    row.upload_ms.toFixed(1),
    row.total_ms.toFixed(1),
    row.error_type,
    `"${row.error_message.replace(/"/g, '""')}"`
  ].join(',')
}

// ---------------------------------------------------------------------------
// Single upload task
// ---------------------------------------------------------------------------

async function uploadOne(
  docIndex: number,
  sample: SampleFile,
  uploadedKeys: string[]
): Promise<CsvRow> {
  const documentKey = randomUUID()
  const bucketKey = generateBucketKeyForDocument(documentKey)
  const timing: UploadTiming = { kmsMs: 0 }

  const row: CsvRow = {
    timestamp: new Date().toISOString(),
    doc_index: docIndex,
    filename: sample.name,
    size_bytes: sample.sizeBytes,
    concurrency,
    kms_ms: 0,
    encrypt_ms: 0,
    upload_ms: 0,
    total_ms: 0,
    error_type: '',
    error_message: ''
  }

  const totalStart = performance.now()

  try {
    const encryptResult = await timingStore.run(timing, () =>
      encrypt(encryptConfig, sample.data, { documentKey })
    )
    const encryptEnd = performance.now()

    row.kms_ms = timing.kmsMs
    row.encrypt_ms = encryptEnd - totalStart - timing.kmsMs

    const s3Client = getS3Client(s3Config)
    const uploadStart = performance.now()

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: s3Config.s3.bucket,
        Body: Buffer.from(encryptResult.encryptedContent),
        Key: bucketKey,
        ContentType: 'application/octet-stream',
        Metadata: {
          'encrypted': 'true',
          'encryption-version': encryptConfig.document.encryptionVersion,
          'encryption-algorithm': encryptConfig.document.encryptionAlgorithm,
          'iv': encryptResult.ivBase64
        }
      }
    })

    await upload.done()
    row.upload_ms = performance.now() - uploadStart
    uploadedKeys.push(bucketKey)
  } catch (err: unknown) {
    const root = unwrapCause(err)
    row.error_type = classifyError(root)
    row.error_message = `${String(err)} - ${root.message}`
  }

  row.total_ms = performance.now() - totalStart
  return row
}

type ClassifiableError = Error & {
  statusCode?: number
  status?: number
  code?: string
  hostname?: string
  cause?: unknown
}

function unwrapCause(err: unknown): ClassifiableError {
  const e = err as ClassifiableError
  if (e.cause && e.cause instanceof Error && (e.cause as any).code) {
    return e.cause as ClassifiableError
  }
  return e
}

function classifyError(err: ClassifiableError): string {
  const httpCode = err.statusCode ?? err.status ?? 0
  const msg = err.message?.toLowerCase() ?? ''
  const errCode = (err.code ?? '').toUpperCase()

  if (msg.includes('generatedata') || msg.includes('transit')) {
    if (httpCode === 429) {
      return 'KMS_429'
    }
    if (httpCode >= 500) {
      return 'KMS_5XX'
    }
    return 'KMS_ERROR'
  }
  if (msg.includes('token') || msg.includes('auth') || msg.includes('login')) {
    return 'KMS_TOKEN_REFRESH'
  }
  if (errCode === 'ENOTFOUND') {
    return 'DNS_RESOLUTION_FAILED'
  }
  if (errCode === 'ECONNREFUSED') {
    return 'S3_CONNECTION_REFUSED'
  }
  if (errCode === 'ECONNRESET' || errCode === 'EPIPE') {
    return 'S3_CONNECTION_RESET'
  }
  if (errCode === 'ETIMEDOUT' || errCode === 'ESOCKETTIMEDOUT') {
    return 'S3_TIMEOUT'
  }
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return 'S3_TIMEOUT'
  }
  if (msg.includes('econnr') || msg.includes('socket')) {
    return 'S3_CONNECTION'
  }
  if (httpCode === 403) {
    return 'S3_FORBIDDEN'
  }
  if (httpCode === 429) {
    return 'S3_THROTTLED'
  }
  if (httpCode >= 500) {
    return 'S3_5XX'
  }
  return 'UNKNOWN'
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) {
    return 0
  }
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) {
    return sorted[lo]!
  }
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (idx - lo)
}

function computeStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return {
    min: Math.round(sorted[0] ?? 0),
    p50: Math.round(percentile(sorted, 50)),
    p95: Math.round(percentile(sorted, 95)),
    p99: Math.round(percentile(sorted, 99)),
    max: Math.round(sorted[sorted.length - 1] ?? 0)
  }
}

// ---------------------------------------------------------------------------
// Worker pool
// ---------------------------------------------------------------------------

async function runPool(samples: SampleFile[]) {
  const rows: CsvRow[] = []
  const uploadedKeys: string[] = []
  let nextIndex = 0

  const startTime = performance.now()
  let lastProgressPct = -1

  async function worker() {
    while (true) {
      const idx = nextIndex++
      if (idx >= total) {
        break
      }
      const sample = samples[idx % samples.length]!
      const row = await uploadOne(idx, sample, uploadedKeys)
      rows.push(row)

      const pct = Math.floor((rows.length / total) * 100)
      if (pct > lastProgressPct && pct % 5 === 0) {
        lastProgressPct = pct
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(0)
        const rate = (
          rows.length /
          ((performance.now() - startTime) / 1000)
        ).toFixed(1)
        process.stdout.write(
          `\r  ${pct}% (${rows.length}/${total}) — ${elapsed}s elapsed — ${rate} docs/sec`
        )
      }
    }
  }

  console.log(
    `\nStarting ${total} uploads with concurrency=${concurrency}...\n`
  )

  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)

  process.stdout.write('\n\n')

  const durationS = (performance.now() - startTime) / 1000

  return { rows, uploadedKeys, durationS }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

async function writeResults(rows: CsvRow[], durationS: number) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const resultsDir = join(import.meta.dirname, 'ignore/results')
  await mkdir(resultsDir, { recursive: true })

  const csvPath = join(resultsDir, `results-${concurrency}-${ts}.csv`)
  const csvContent = [CSV_HEADER, ...rows.map(csvLine)].join('\n')
  await writeFile(csvPath, csvContent)
  console.log(`CSV written to ${csvPath}`)

  const successful = rows.filter(r => !r.error_type)
  const failed = rows.filter(r => !!r.error_type)

  const totalDataMb =
    successful.reduce((sum, r) => sum + r.size_bytes, 0) / (1024 * 1024)

  const errorCounts: Record<string, number> = {}
  for (const r of failed) {
    errorCounts[r.error_type] = (errorCounts[r.error_type] ?? 0) + 1
  }

  const summary: Summary = {
    concurrency,
    total,
    successful: successful.length,
    failed: failed.length,
    duration_s: Math.round(durationS),
    throughput_docs_per_sec: parseFloat(
      (successful.length / durationS).toFixed(1)
    ),
    throughput_mb_per_sec: parseFloat((totalDataMb / durationS).toFixed(1)),
    total_data_mb: parseFloat(totalDataMb.toFixed(1)),
    latency_ms: {
      kms: computeStats(successful.map(r => r.kms_ms)),
      encrypt: computeStats(successful.map(r => r.encrypt_ms)),
      upload: computeStats(successful.map(r => r.upload_ms)),
      total: computeStats(successful.map(r => r.total_ms))
    },
    errors: errorCounts
  }

  const jsonPath = join(resultsDir, `summary-${concurrency}-${ts}.json`)
  await writeFile(jsonPath, JSON.stringify(summary, null, 2))
  console.log(`JSON summary written to ${jsonPath}`)

  printSummaryTable(summary)

  return summary
}

function printSummaryTable(summary: Summary) {
  console.log('\n' + '='.repeat(72))
  console.log('  PERFORMANCE SUMMARY')
  console.log('='.repeat(72))
  console.log(`  Concurrency:       ${summary.concurrency}`)
  console.log(`  Total uploads:     ${summary.total}`)
  console.log(
    `  Successful:        ${summary.successful}  |  Failed: ${summary.failed}`
  )
  console.log(`  Duration:          ${summary.duration_s}s`)
  console.log(
    `  Throughput:        ${summary.throughput_docs_per_sec} docs/sec  |  ${summary.throughput_mb_per_sec} MB/sec`
  )
  console.log(`  Total data:        ${summary.total_data_mb} MB`)
  console.log('')
  console.log('  Phase          min     p50     p95     p99     max     (ms)')
  console.log('  ' + '-'.repeat(62))
  for (const [phase, stats] of Object.entries(summary.latency_ms)) {
    console.log(
      `  ${phase.padEnd(14)} ${String(stats.min).padStart(6)}  ${String(stats.p50).padStart(6)}  ${String(stats.p95).padStart(6)}  ${String(stats.p99).padStart(6)}  ${String(stats.max).padStart(6)}`
    )
  }

  if (Object.keys(summary.errors).length) {
    console.log('')
    console.log('  Errors:')
    for (const [type, count] of Object.entries(summary.errors)) {
      console.log(`    ${type}: ${count}`)
    }
  }

  const migrationSeconds = (350 * 1024) / summary.throughput_mb_per_sec
  const migrationHours = (migrationSeconds / 3600).toFixed(1)
  console.log('')
  console.log(
    `  350GB migration estimate at ${summary.throughput_mb_per_sec} MB/sec: ~${migrationHours} hours`
  )
  console.log('='.repeat(72) + '\n')
}

interface Summary {
  concurrency: number
  total: number
  successful: number
  failed: number
  duration_s: number
  throughput_docs_per_sec: number
  throughput_mb_per_sec: number
  total_data_mb: number
  latency_ms: Record<string, ReturnType<typeof computeStats>>
  errors: Record<string, number>
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

async function cleanupObjects(keys: string[]) {
  if (!keys.length) {
    console.log('No objects to clean up.')
    return
  }
  console.log(`Cleaning up ${keys.length} uploaded objects...`)
  await deleteFiles(fullConfig, keys)
  console.log('Cleanup complete.')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Document Upload Performance Study')
  console.log(
    `  concurrency=${concurrency}  total=${total}  cleanup=${cleanup}`
  )

  const samples = await loadSamples()

  console.log('Initializing KMS client (OpenBao AppRole login)...')
  await patchKmsClientWithTiming()
  console.log('KMS client ready.')

  console.log('Initializing S3 client...')
  getS3Client(s3Config)
  console.log('S3 client ready.')

  const { rows, uploadedKeys, durationS } = await runPool(samples)

  await writeResults(rows, durationS)

  if (cleanup) {
    await cleanupObjects(uploadedKeys)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
