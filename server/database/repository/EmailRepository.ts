import { prismaClient } from '~/server/prisma'

export const EmailRepo = {
  prisma: {
    create: prismaClient.email.create,
    findMany: prismaClient.email.findMany
  }
}
