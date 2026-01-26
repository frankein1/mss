import type { Prisma } from '@prisma/client'
import { MinisterRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { idSchema } from '~/server/schema'
import type { AdminContext } from '~/server/trpc'
import type { IdInput } from '~/server/schema'

const adminHandler = async ({
  ctx: { user },
  input
}: {
  ctx: AdminContext
  input: IdInput
}) => {
  return await MinisterRepo.findUnique(user, {
    where: { id: input.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      // function: true,
      ministry: true,
      government: true,
      former: true
    }
  })
}

export type AdminMinistersOutput = Prisma.PromiseReturnType<typeof adminHandler>

export const getMinister = createQuery({
  inputValidation: idSchema,
  adminHandler
})
