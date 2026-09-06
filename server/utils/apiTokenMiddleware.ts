import type { H3Event } from 'h3'
import { prismaClient } from '~~/server/prisma'
import { enrichPublicApiLogger } from './logger'

const apiTokenMiddleware = async (event: H3Event) => {
  const authorization = getRequestHeader(event, 'authorization')

  if (!authorization) {
    throw createError({
      statusCode: 400,
      message: 'authorization is required'
    })
  }

  let token

  if (authorization.startsWith('Bearer ')) {
    token = authorization.substring(7, authorization.length)
  } else {
    throw createError({
      statusCode: 400,
      message: 'Bearer is required'
    })
  }

  const apiToken = await prismaClient.apiToken.findUnique({
    select: { id: true },
    where: {
      token,
      expirationDate: {
        gt: new Date()
      }
    }
  })

  if (!apiToken) {
    throw createError({
      statusCode: 400,
      message: 'Token is not valid'
    })
  }

  enrichPublicApiLogger(event, apiToken.id)
}

export default apiTokenMiddleware
