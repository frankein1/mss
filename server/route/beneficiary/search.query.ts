import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SearchBeneficiaryInput,
  searchBeneficiarySchema
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryRepo } from '~/server/database'

const tokenToSearchCondition = (token: string) => ({
  contains: token,
  mode: 'insensitive'
})

const securityCheck = AllowSecurityCheck

const handler = async ({
  input: { query, excludedIds },
  ctx: { user }
}: {
  input: SearchBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  // TODO unit test
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['firstName', 'birthName', 'usualName', 'fileNumber'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: tokenToSearchCondition(token)
    }))
  }))

  const where = {
    AND: searchConditions,
    id: { notIn: excludedIds }
  }

  // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
  // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
  const beneficiaries = await BeneficiaryRepo.findMany(user, {
    where,
    orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
    select: {
      id: true,
      usualName: true,
      firstName: true,
      birthName: true,
      fileNumber: true,
      birthDate: true
    }
  })

  return beneficiaries
}

export const searchBeneficiaryQuery = createQuery({
  inputValidation: searchBeneficiarySchema,
  securityCheck,
  handler
})
