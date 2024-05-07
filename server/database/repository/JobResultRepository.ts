import { prismaClient } from '~/server/prisma'

export const JobResultRepo = {
  prisma: {
    create: prismaClient.jobResult.create,
    findMany: prismaClient.jobResult.findMany,
    update: prismaClient.jobResult.update,
    count: prismaClient.jobResult.count,
    findFirst: prismaClient.jobResult.findFirst
  }
}
