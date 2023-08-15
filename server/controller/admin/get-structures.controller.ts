import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { AdminGetStructuresInput } from '~/server/schema'

export const getStructuresController = async ({
  input
}: {
  input: AdminGetStructuresInput
}) => {
  let where = {}
  if (input.search) {
    where = {
      OR: [
        {
          name: {
            contains: input.search,
            mode: 'insensitive'
          }
        },
        {
          zipcode: {
            startsWith: input.search
          }
        }
      ]
    }
  }
  const structures = await prismaClient.structure.findMany({
    where,
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
      userActivities: {
        take: 1,
        orderBy: {
          date: 'desc'
        }
      },
      siret: true,
      _count: {
        select: {
          beneficiaries: true,
          users: true
        }
      }
    },
    orderBy: input.orderBy
  })

  return { structures }
}

export type AdminStructuresOutput = Prisma.PromiseReturnType<
  typeof getStructuresController
>
