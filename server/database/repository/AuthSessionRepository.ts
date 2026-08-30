import { prismaClient } from '~~/server/prisma'

export const AuthSessionRepo = {
  prisma: {
    findUnique: prismaClient.authSession.findUnique,
    create: prismaClient.authSession.create,
    update: prismaClient.authSession.update,
    delete: prismaClient.authSession.delete,
    deleteMany: prismaClient.authSession.deleteMany
  }
}
