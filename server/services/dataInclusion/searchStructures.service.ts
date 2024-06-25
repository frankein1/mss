import { Prisma } from '@prisma/client'
import { SecurityRuleContext } from '~/server/security'
import { DataInclusionStructureRepo } from '~/server/database/repository'
import { SearchDataInclusionStructureInput } from '~/server/schema'
import { StructureRepo } from '~/server/database'

function getQueryForDepartmentSearch(zipcode: string) {
  const query = zipcode.substring(0, zipcode.startsWith('97') ? 3 : 2)
  return {
    zipcode: {
      startsWith: query,
      not: zipcode
    }
  }
}

function prepareSearch(
  query: string,
  zipcode: string,
  scale: 'city' | 'department' | 'country'
) {
  const where: Prisma.DataInclusionStructureWhereInput = {
    name: {
      contains: query,
      mode: 'insensitive'
    }
  }

  switch (scale) {
    case 'department':
      return { ...where, ...getQueryForDepartmentSearch(zipcode) }
    case 'country':
      return where
    default:
      return { ...where, zipcode }
  }
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

  const city = prepareSearch(input.query, s.zipcode, 'city')
  const department = prepareSearch(input.query, s.zipcode, 'department')

  const res = await Promise.all([
    DataInclusionStructureRepo.findMany(ctx.user, { where: city }),
    DataInclusionStructureRepo.findMany(ctx.user, { where: department })
  ])

  if (res[0].length || res[1].length) {
    return {
      scale: res[0].length ? ('city' as const) : ('department' as const),
      results: [...res[0], ...res[1]]
    }
  }

  const country = prepareSearch(input.query, s.zipcode, 'country')
  const results = await DataInclusionStructureRepo.findMany(ctx.user, {
    where: country
  })

  return {
    scale: 'country' as const,
    results
  }
}
