import { prismaClient } from '~/server/prisma'

export const ArchivedBeneficiaryRepo = {
  prisma: {
    create: prismaClient.archivedBeneficiary.create,
    findMany: prismaClient.archivedBeneficiary.findMany,
    delete: prismaClient.archivedBeneficiary.delete,
    updateMany: prismaClient.archivedBeneficiary.updateMany
  }
}
