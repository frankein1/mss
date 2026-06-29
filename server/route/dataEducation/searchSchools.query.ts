import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DataEducationSchoolRepo } from '~/server/database'
import {
  searchDataEducationSchoolSchema,
  type SearchDataEducationSchoolInput
} from '~/server/schema'
import { SEARCH_RESULTS_LIMIT } from '~/utils/constants'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SearchDataEducationSchoolInput
  ctx: ProtectedAppContext
}) => {
  return await DataEducationSchoolRepo.findMany(ctx.user, {
    where: {
      citycode: input.citycode,
      name: {
        contains: input.query,
        mode: 'insensitive'
      }
    },
    take: SEARCH_RESULTS_LIMIT + 1,
    select: {
      uai: true,
      name: true,
      address: true,
      zipcode: true,
      citycode: true,
      city: true,
      status: true
    }
  })
}

export const searchSchools = createQuery({
  inputValidation: searchDataEducationSchoolSchema,
  securityCheck,
  handler
})
