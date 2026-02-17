import type { Prisma } from '@prisma/client'
import { MinisterRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'

const adminHandler = async ({ ctx: { user } }: { ctx: AdminContext }) => {
  return await MinisterRepo.findMany(user, {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      function: true,
      government: true,
      status: true
    },
    orderBy: { lastName: 'asc' }
  })
}

export type AdminMinistersOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getMinisters = createQuery({
  inputValidation: emptySchema,
  adminHandler
})
