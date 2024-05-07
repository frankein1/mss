import { defineEventHandler } from 'h3'
import { StructureRepo } from '~/server/database'
import { prismaClient } from '~/server/prisma'

export default defineEventHandler(async event => {
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

  return await StructureRepo.prisma.findMany({
    select: {
      id: true,
      siret: true,
      type: true,
      name: true,
      zipcode: true,
      city: true,
      address: true
    },
    orderBy: [{ name: 'desc' }]
  })
})
