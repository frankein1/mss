import { defineEventHandler } from 'h3'
import { DocumentRepo } from '~/server/database'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (
    !user ||
    user.status !== 'Active' ||
    user.role === 'Administrator' ||
    !user.structureId
  ) {
    throw forbiddenError()
  }
  const query = getQuery(event)

  const key = query.key

  const document = await DocumentRepo.findUniqueOrThrow(user, {
    where: {
      key: '' + key
    },
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

  event.node.res.setHeader('Content-Type', document.mimeType)
  event.node.res.setHeader('Content-Length', '' + document.size)
  event.node.res.setHeader(
    'Content-Disposition',
    `attachment; filename="${document.name}"`
  )

  return documentContent.content
})
