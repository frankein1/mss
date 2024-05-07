import { Prisma } from '@prisma/client'
import { SecurityRuleContext } from '~/server/security'
import { DataInclusionStructureRepo } from '~/server/database/repository'
import { SearchDataInclusionStructureInput } from '~/server/schema'

function prepareSearch(query: string, zipcode: string) {
  const where: Prisma.DataInclusionStructureWhereInput = {
    OR: [
      {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      {
        siret: {
          startsWith: query
        }
      }
    ],
    zipcode
  }

  return where
}

export async function searchStructures({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: SearchDataInclusionStructureInput
}) {
  const where = prepareSearch(input.query, input.zipcode)

  return await DataInclusionStructureRepo.findMany(ctx.user, {
    select: {
      id: true,
      name: true,
      siret: true,
      address: true,
      city: true,
      zipcode: true
    },
    where
  })
}
