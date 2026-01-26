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
import { S3Client } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import {
  generateFileRootForDocument,
  generateFilenameForDocument
} from '~/server/services/document/helper'
import { performance } from 'node:perf_hooks'
import { Upload } from '@aws-sdk/lib-storage'
import * as Sentry from '@sentry/node'

const prismaClient = new PrismaClient()

const BATCH_SIZE_DOCUMENTS_TO_MIGRATE = parseInt(
  process.env.BATCH_SIZE_DOCUMENTS_TO_MIGRATE || '1000'
)

const BUCKET_NAME = process.env.NUXT_S3_BUCKET || process.env.S3_BUCKET || ''
const ACCESS_KEY =
  process.env.NUXT_S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID || ''
const SECRET_KEY =
  process.env.NUXT_S3_SECRET_ACCESS_KEY ||
  process.env.S3_SECRET_ACCESS_KEY ||
  ''
const REGION = process.env.NUXT_S3_REGION || process.env.S3_REGION || ''
const ENDPOINT = process.env.NUXT_S3_ENDPOINT || process.env.S3_ENDPOINT || ''
const SENTRY_DSN = process.env.SENTRY_DSN

function getS3Client() {
  return new S3Client({
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY
    },
    region: REGION,
    endpoint: ENDPOINT
  })
}

export async function migrateDocumentsToS3() {
  console.log(
    `migrate-documents-to-s3-bucket: [${new Date().toISOString()}]: starting with ${BATCH_SIZE_DOCUMENTS_TO_MIGRATE} documents to migrate`
  )
  const client = getS3Client()

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
  for (const { key, name, mimeType, beneficiary, documentContent } of docs) {
    if (!documentContent) {
      i++
      continue
    }

    const filename = generateFilenameForDocument(name)
    const filepath = `${generateFileRootForDocument(beneficiary.structureId, beneficiary.id)}/${filename}`
    try {
      await migrateDocument(client, filepath, mimeType, documentContent.content)
      await setDocumentAsMigrated(key)
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

    if (i % 100 === 0) {
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

async function setDocumentAsMigrated(key: string) {
  return await prismaClient.document.update({
    select: { key: true },
    where: { key },
    data: { migrated: true }
  })
}

/** Upload the document on S3 bucket with the key filepath */
async function migrateDocument(
  client: S3Client,
  filepath: string,
  mimeType: string,
  content: Uint8Array
) {
  await migrateToS3(client, filepath, Buffer.from(content), mimeType)
}

export async function migrateToS3(
  client: S3Client,
  key: string,
  data: Buffer,
  contentType: string
) {
  const upload = new Upload({
    client,
    params: {
      Bucket: BUCKET_NAME,
      Body: data,
      Key: key,
      ContentType: contentType
    }
  })

  const res = await upload.done()

  return res.Key
}

migrateDocumentsToS3()
