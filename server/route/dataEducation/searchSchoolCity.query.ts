import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DataEducationSchoolRepo } from '~/server/database'
import {
  searchDataEducationSchoolCitySchema,
  type SearchDataEducationSchoolCityInput
} from '~/server/schema'
import { SEARCH_RESULTS_LIMIT } from '~/utils/constants'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SearchDataEducationSchoolCityInput
  ctx: ProtectedAppContext
}) => {
  return await DataEducationSchoolRepo.findMany(ctx.user, {
    where: {
      city: {
        contains: input.query,
        mode: 'insensitive'
      }
    },
    orderBy: {
      zipcode: 'asc'
    },
    distinct: ['citycode'],
    take: SEARCH_RESULTS_LIMIT + 1,
    select: {
      city: true,
      zipcode: true,
      citycode: true
    }
  })
}

export const searchSchoolCities = createQuery({
  inputValidation: searchDataEducationSchoolCitySchema,
  securityCheck,
  handler
})
