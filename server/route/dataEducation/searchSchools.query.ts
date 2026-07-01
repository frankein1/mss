import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { DataEducationSchoolRepo } from '~/server/database'
import {
  searchDataEducationSchoolSchema,
  type SearchDataEducationSchoolInput
} from '~/server/schema'
import { SCHOOL_REQUEST_LIMIT_DEFAULT } from '~/utils/constants'

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
    orderBy: [{ name: 'asc' }, { uai: 'asc' }],
    take: SCHOOL_REQUEST_LIMIT_DEFAULT + 1,
    select: {
      uai: true,
      name: true,
      type: true,
      address: true,
      zipcode: true,
      citycode: true,
      city: true,
      academy: true,
      status: true,
      repClassification: true,
      qpvCode: true,
      qpvName: true
    }
  })
}

export const searchSchools = createQuery({
  inputValidation: searchDataEducationSchoolSchema,
  securityCheck,
  handler
})
