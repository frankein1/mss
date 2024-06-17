import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  AdminGetStructuresInput,
  adminGetStructuresSchema
} from '~/server/schema'
import { StructureRepo } from '~/server/database'
import { AdminContext } from '~/server/trpc'
import { canBeDisabled } from '~/utils/structure'

const adminHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AdminContext
  input: AdminGetStructuresInput
}) => {
  let where = {}
  if (input?.search) {
    where = {
      disable: false,
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
  const structures = await StructureRepo.findMany(user, {
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
      siret: true,
      disable: true,
      lastAccess: true
    },
    orderBy: {
      lastAccess: 'desc'
    }
  })

  return {
    structures: structures.map(({ lastAccess, ...data }) => ({
      ...data,
      lastAccess,
      canBeDisabled: canBeDisabled({ lastAccess })
    }))
  }
}

export type AdminStructuresOutput = Prisma.PromiseReturnType<
  typeof adminHandler
>

export const getStructures = createQuery({
  inputValidation: adminGetStructuresSchema,
  adminHandler
})
