import { AppContext, forbiddenError } from '~/server/trpc'
import { canListBeneficiaries } from '~/server/query/security/rules'
import { SearchBeneficiaryInput } from '~/server/schema/beneficiary.schema'
import { prismaClient } from '~/server/prisma'

const tokenToSearchCondition = (token: string) => ({
  contains: token,
  mode: 'insensitive'
})

export const searchBeneficiaryHandler = async ({
  input: { query, excludedIds },
  ctx: { user }
}: {
  input: SearchBeneficiaryInput
  ctx: AppContext
}) => {
  const { structureId } = user

  if (!canListBeneficiaries(user, { structureId })) {
    throw forbiddenError()
  }
  // TODO unit test
  const tokens = query.trim().replace(/%/g, '').split(/\s+/g)

  const fields = ['firstName', 'birthName', 'usualName', 'fileNumber'] as const

  const searchConditions = tokens.map(token => ({
    OR: fields.map(field => ({
      [field]: tokenToSearchCondition(token)
    }))
  }))

  const where = {
    archived: null,
    AND: searchConditions,
    id: { notIn: excludedIds },
    structureId: structureId || undefined
  }

  // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
  // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
  const beneficiaries = await prismaClient.beneficiary.findMany({
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
