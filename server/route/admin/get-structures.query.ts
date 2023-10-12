import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import {
  AdminGetStructuresInput,
  adminGetStructuresSchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { StructureRepo } from '~/server/repository'
import { AdminContext } from '~/server/trpc/createRouter'

const adminHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AdminContext
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
          users: true,
          helpRequests: true,
          followups: true
        }
      }
    },
    orderBy: input.orderBy
  })

  return { structures }
}

export type AdminStructuresOutput = Prisma.PromiseReturnType<
  typeof adminHandler
>

export const getAdminStructuresQuery = createQuery({
  inputValidation: adminGetStructuresSchema,
  securityCheck: AllowSecurityCheck,
  adminHandler
})
