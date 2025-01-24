import { prismaClient } from '~/server/prisma'

export const ArchivedBeneficiaryRepo = {
  prisma: {
    create: prismaClient.archivedBeneficiary.create
  }
}
