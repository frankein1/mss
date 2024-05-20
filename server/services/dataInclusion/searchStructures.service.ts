import { Prisma } from '@prisma/client'
import { SecurityRuleContext } from '~/server/security'
import { DataInclusionStructureRepo } from '~/server/database/repository'
import { SearchDataInclusionStructureInput } from '~/server/schema'
import { StructureRepo } from '~/server/database'

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
  const { user, structure } = ctx
  const s = await StructureRepo.findUniqueOrThrow(user, {
    where: { id: structure.id }
  })

  const where = prepareSearch(input.query, s.zipcode)

  return await DataInclusionStructureRepo.findMany(ctx.user, { where })
}
