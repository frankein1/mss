import { prismaClient } from '~/server/prisma'

export const getStructuresController = async () => {
  const structures = await prismaClient.structure.findMany({
    select: {
      id: true,
      type: true,
      name: true,
      zipcode: true,
      city: true,
      address: true,
      phone: true,
      email: true,
      inhabitantsNumber: true,
      inseeCode: true,
      siret: true,
      _count: {
        select: {
          beneficiaries: true,
          users: true
        }
      }
    }
  })

  return { structures }
}
