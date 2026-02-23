/** Script de migration de DB vers S3
 *
 * Il sera lancé via one-off container : https://doc.scalingo.com/platform/app/tasks
 * qui tourne tant que des écritures sont effectuées sur la sortie std/erreur.
 * `scalingo -a [app-name] --region [region] run --size="L" tsx server/scheduler/migrations/migrate-documents-to-s3-bucket.ts`
 *
 * Il permet de migrer une quantité fixe de documents définie par BATCH_SIZE_DOCUMENTS_TO_MIGRATE
 *
 * Un document migré est noté dans la base grâce à la colonne `migrated`
 * Les erreurs d'exécution sont logguées dans la console (si one-off attached), dans les logs d'application (si one-off detached)
 * et dans Sentry
 */
import { PrismaClient } from '@prisma/client'
import {
  generateFileRootForDocument,
  generateFilenameForDocument
} from '~/server/services/document/helper'
import { performance } from 'node:perf_hooks'
import * as Sentry from '@sentry/node'
import { uploadWithEncryption } from '~/server/lib/s3/file'

const prismaClient = new PrismaClient()

const BATCH_SIZE_DOCUMENTS_TO_MIGRATE = parseInt(
  process.env.BATCH_SIZE_DOCUMENTS_TO_MIGRATE || '1000'
)

const SENTRY_DSN = process.env.SENTRY_DSN

const config = {
  s3: {
    accessKeyId:
      process.env.NUXT_S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey:
      process.env.NUXT_S3_SECRET_ACCESS_KEY ||
      process.env.S3_SECRET_ACCESS_KEY ||
      '',
    region: process.env.NUXT_S3_REGION || process.env.S3_REGION || '',
    bucket: process.env.NUXT_S3_BUCKET || process.env.S3_BUCKET || '',
    endpoint: process.env.NUXT_S3_ENDPOINT || process.env.S3_ENDPOINT || ''
  },
  kms: {
    accessKeyId: process.env.KMS_ACCESS_KEY_ID || '',
    secretKey: process.env.KMS_SECRET_KEY || '',
    organizationId: process.env.KMS_ORGANIZATION_ID || '',
    projectId: process.env.KMS_PROJECT_ID || '',
    region: process.env.KMS_REGION || '',
    apiUrl: process.env.KMS_API_URL || '',
    keyId: process.env.KMS_KEY_ID || ''
  },
  document: {
    encryptionVersion: '1',
    encryptionAlgorithm: 'aes_256_gcm'
  }
}

export async function migrateDocumentsToS3() {
  console.log(
    `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: starting with ${BATCH_SIZE_DOCUMENTS_TO_MIGRATE} documents to migrate`
  )

  if (SENTRY_DSN) {
    console.log(
      `cleanup-user-activities: [${new Date().toISOString()}]: sentry initialization`
    )
    Sentry.init({ dsn: SENTRY_DSN })
  }

  let start = performance.now()
  const docs = await getDocumentBatch()
  let end = performance.now()
  console.log(
    `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: document retrieval in ${duration(start, end)}s`
  )

  let i = 0
  start = performance.now()
  for (const {
    key,
    name,
    mimeType,
    size,
    beneficiary,
    documentContent
  } of docs) {
    if (!documentContent) {
      i++
      continue
    }

    const filename = generateFilenameForDocument(name)
    const filepath = `${generateFileRootForDocument(beneficiary.structureId, beneficiary.id)}/${filename}`
    try {
      if (!size) {
        throw new Error(
          `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: no size for document ${key}`
        )
      }
      await migrateDocument({
        documentKey: key,
        bucketKey: filepath,
        data: Buffer.from(documentContent.content),
        contentType: mimeType,
        contentLength: size
      })
      await setDocumentAsMigrated(key, filepath)
    } catch (e: unknown) {
      console.error(
        `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: error for document `,
        key,
        'name ',
        name,
        e
      )
      if (SENTRY_DSN) {
        Sentry.captureException(e)
      }
    }
    i++

    if (i % 10 === 0) {
      console.log(
        `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: ${i}/${BATCH_SIZE_DOCUMENTS_TO_MIGRATE} documents migrated`
      )
    }
  }
  end = performance.now()
  console.log(
    `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: document migration in ${duration(start, end)}s`
  )

  if (SENTRY_DSN) {
    await Sentry.close(2000)
  }
}

function duration(start: number, end: number) {
  return (end - start) / 1000
}

async function getDocumentBatch(
  take: number = BATCH_SIZE_DOCUMENTS_TO_MIGRATE
) {
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
    take
  })
}

async function setDocumentAsMigrated(documentKey: string, bucketKey: string) {
  return await prismaClient.document.update({
    select: { key: true },
    where: {
      key: documentKey
    },
    data: {
      migrated: true,
      filenameDisk: bucketKey,
      filenameDownload: bucketKey
    }
  })
}

/** Upload the document on S3 bucket with the key filepath */
async function migrateDocument(document: {
  documentKey: string
  bucketKey: string
  data: Buffer
  contentType: string
  contentLength: number
}) {
  const res = await uploadWithEncryption({
    config,
    bucketKey: document.bucketKey,
    plainData: document.data,
    dataForEncryptionContext: {
      documentKey: document.documentKey,
      contentType: document.contentType,
      contentLength: document.contentLength
    }
  })

  return res.key
}

migrateDocumentsToS3()
