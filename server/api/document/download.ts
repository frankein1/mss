import { UserActivityType } from '@prisma/client'
import { defineEventHandler } from 'h3'
import { DocumentRepo } from '~/server/database'
import { addUserActivity } from '~/server/query'
import { DocumentService } from '~/server/services'
import { badrequest, forbidden, internal } from '~/utils/api/errors'
import { prismaClient } from '~/server/prisma'
import { downloadWithEncryption } from '~/server/lib/s3/file'

export default defineEventHandler(async event => {
  const user = event.context.auth?.user
  if (
    !user ||
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId
  ) {
    throw forbidden('download: not authorized')
  }
  const query = getQuery(event)

  const key = query.key?.toString()

  if (!key) {
    throw badrequest('download: missing document id')
  }

  if (!user.structureType) {
    throw badrequest('download: missing structure type')
  }

  const ctx = {
    user,
    structure: {
      id: user.structureId,
      type: user.structureType,
      externalRdvspActive: null
    }
  }

  const { permissions } = await DocumentService.getEditionPermissions(ctx, key)

  if (!permissions.view) {
    throw forbidden('download: user is not allowed to view document')
  }

  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: { key },
    select: {
      mimeType: true,
      name: true,
      size: true,
      migrated: true,
      filenameDisk: true
    }
  })

  let documentContent: Uint8Array

  if (!document.migrated) {
    // Retrieve document from local database

    // The use of prismaClient is possible here because the document key has already
    // been validated for access with `DocumentService.getEditionPermissions`
    const d = await prismaClient.documentContent.findUniqueOrThrow({
      where: { documentKey: key },
      select: { content: true }
    })
    documentContent = d.content
  } else {
    // Retrieve document from S3 bucket
    const config = useRuntimeConfig()

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
      }
    })

    if (!res.success) {
      console.error(`download: ${res.reason}`)
      throw badrequest(`download: failure to download document`)
    }

    documentContent = Buffer.from(res.fileContent)
  }

  if (!documentContent) {
    throw badrequest('download: could not retrieve document content')
  }

  addUserActivity({
    key: 'document.download',
    user,
    activity: UserActivityType.EXPORT,
    object: 'Document',
    objectId: key,
    content: null
  }).catch(error => console.error(error))

  // TODO: add headers for more security cache ? csp ?hsts ?
  event.node.res.setHeader('Content-Type', document.mimeType)
  event.node.res.setHeader('Content-Length', '' + documentContent.length)
  event.node.res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(document.name)}"`
  )

  return documentContent
})
