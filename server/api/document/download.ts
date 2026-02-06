import { UserActivityType } from '@prisma/client'
import { defineEventHandler } from 'h3'
import { requireAuthenticated } from '~/server/auth/auth-middleware'
import { DocumentRepo } from '~/server/database'
import { addUserActivity } from '~/server/query'
import { DocumentService } from '~/server/services'
import { badrequest, forbidden } from '~/utils/api/errors'

export default defineEventHandler({
  onRequest: [requireAuthenticated],
  handler: async event => {
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

    const { permissions } = await DocumentService.getEditionPermissions(
      ctx,
      key
    )

    if (!permissions.view) {
      throw forbidden('download: user is not allowed to view document')
    }

    const document = await DocumentRepo.findUniqueOrThrow(user, {
      where: { key },
      select: {
        mimeType: true,
        name: true,
        size: true,
        documentContent: {
          select: {
            id: true,
            content: true
          }
        }
      }
    })

    const documentContent = document.documentContent

    if (!documentContent) {
      throw createError('No document found')
    }

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

    return documentContent.content
  }
})
