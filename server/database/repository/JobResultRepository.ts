import { prismaClient } from '~/server/prisma'

export const JobResultRepo = {
  prisma: {
    create: prismaClient.jobResult.create,
    update: prismaClient.jobResult.update
  }
}
