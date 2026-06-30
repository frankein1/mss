import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DataEducationSchoolRepo } from '~/server/database'
import {
  searchDataEducationSchoolCitySchema,
  type SearchDataEducationSchoolCityInput
} from '~/server/schema'
import { SCHOOL_REQUEST_LIMIT_DEFAULT } from '~/utils/constants'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SearchDataEducationSchoolCityInput
  ctx: ProtectedAppContext
}) => {
  const hasDigits = /\d/.test(input.query)

  return await DataEducationSchoolRepo.findMany(ctx.user, {
    where: hasDigits
      ? {
          OR: [
            { city: { contains: input.query, mode: 'insensitive' } },
            { zipcode: { startsWith: input.query } }
          ]
        }
      : {
          city: { contains: input.query, mode: 'insensitive' }
        },
    orderBy: {
      zipcode: 'asc'
    },
    distinct: ['citycode'],
    take: SCHOOL_REQUEST_LIMIT_DEFAULT + 1,
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
