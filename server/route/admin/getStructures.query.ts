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
  const where: Prisma.StructureWhereInput = input?.search
    ? {
        disabled: false,
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
    : { disabled: false }

  const structures = await StructureRepo.findMany(user, {
    where,
    select: {
      id: true,
      created: true,
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
      disabled: true,
      deactivationAlertEmail: true,
      lastAccess: true
    },
    orderBy: {
      lastAccess: {
        sort: 'desc',
        nulls: 'last'
      }
    }
  })

  return {
    structures: structures.map(({ lastAccess, created, ...data }) => ({
      ...data,
      created,
      lastAccess,
      canBeDisabled: canBeDisabled({ lastAccess, created })
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
