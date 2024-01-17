import { prismaClient } from '~/server/prisma'

export const HousingHelpRequestRepo = {
  prisma: {
    create: prismaClient.housingHelpRequest.create
  }
}
