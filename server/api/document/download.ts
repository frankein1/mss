import { UserActivityType } from '@prisma/client'
import { defineEventHandler } from 'h3'
import { DocumentRepo } from '~/server/database'
import { addUserActivity } from '~/server/query'
import { DocumentService } from '~/server/services'
import { badrequest, forbidden, internal } from '~/utils/api/errors'
import { prismaClient } from '~/server/prisma'
import type { RuntimeConfig } from 'nuxt/schema'
import { downloadWithEncryption } from '~/server/lib/s3/file'
import {
  fetchUserContext,
  type UserContext
} from '~/server/utils/fetchUserContext'
import { checkUserIsAuthenticated } from '~/server/utils/checkUserIsAuthenticated'

export default defineEventHandler(async event => {
  const userId = event.context.auth?.userId
  if (!userId) {
    throw forbidden('download: not authorized')
  }

  const user = await fetchUserContext(userId)
  checkUserIsAuthenticated(user)

  if (!user.structure) {
    throw forbidden('download: not authorized')
  }

  const query = getQuery(event)

  const key = query.key?.toString()

  if (!key) {
    throw badrequest('download: missing document id')
  }

  const ctx = {
    user,
    structure: user.structure
  }

  const { permissions } = await DocumentService.getEditionPermissions(ctx, key)

  if (!permissions.view) {
    throw forbidden('download: user is not allowed to view document')
  }

  const document = await getDocumentMetadata(key, user)
  const documentContent = await getDocumentContent(key, document)

  addUserActivity({
    key: 'document.download',
    user,
    activity: UserActivityType.EXPORT,
    object: 'Document',
    objectId: key,
    content: null
  }).catch(error => console.error(error))

  event.node.res.setHeader('Content-Type', document.mimeType)
  event.node.res.setHeader('Content-Length', '' + document.size)
  event.node.res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(document.name)}"`
  )

  return documentContent
})

async function getDocumentMetadata(key: string, user: UserContext) {
  return await DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    select: {
      mimeType: true,
      name: true,
      size: true,
      migrated: true,
      filenameDisk: true,
      encryptedDataKey: true
    }
  })
}

type DocumentMetadata = Awaited<ReturnType<typeof getDocumentMetadata>>

async function getDocumentContent(key: string, document: DocumentMetadata) {
  const config = useRuntimeConfig()
  if (config.document.useS3Storage) {
    if (!document.migrated) {
      // Retrieve document content from local database
      return await downloadFromDb(key)
    }
    return await downloadAndDecryptFromS3(config, key, document)
  }

  return await downloadFromDb(key)
}

/** This function should only be used when key has been validated previously
 *
 * Why: It uses prismaClient directly. It is possible here because the document key has already
 * been validated for access with `DocumentService.getEditionPermissions`
 */
async function downloadFromDb(key: string) {
  const d = await prismaClient.documentContent.findUnique({
    where: { documentKey: key },
    select: { content: true }
  })

  if (!d) {
    throw internal('download: could not retrieve content')
  }

  return d.content
}

async function downloadAndDecryptFromS3(
  config: Pick<RuntimeConfig, 'document' | 's3' | 'kms' | 'public'>,
  key: string,
  document: DocumentMetadata
) {
  if (!document.filenameDisk) {
    throw internal('download: missing bucket key')
  }

  if (!document.mimeType || !document.size) {
    throw internal('download: missing document metadata')
  }

  const res = await downloadWithEncryption({
    config,
    bucketKey: document.filenameDisk,
    dataForEncryptionContext: {
      documentKey: key,
      contentType: document.mimeType,
      contentLength: document.size
    },
    encryptedDataKey: document.encryptedDataKey
  })

  if (!res.success) {
    console.error(`download: ${res.reason}`)
    throw internal(`download: failure to download document`)
  }

  return Buffer.from(res.fileContent)
}
