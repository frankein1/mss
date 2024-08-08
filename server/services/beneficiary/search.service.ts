import { prepareBeneficiarySearchConditions } from './helper'
import { SearchBeneficiaryInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo } from '~/server/database'

export async function search({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: SearchBeneficiaryInput
}) {
  const searchConditions = prepareBeneficiarySearchConditions(input.query)

  const where = {
    ...searchConditions,
    id: { notIn: input.excludedIds }
  }

  // TODO benchmark this and stress tes, then create indexes for case-insensitive filtering.
  // TODO check pg_trgm https://www.postgresql.org/docs/12/pgtrgm.html#id-1.11.7.40.7 for indexing
  return await BeneficiaryRepo.findMany(ctx.user, {
    where,
    orderBy: [{ usualName: 'asc' }, { birthName: 'asc' }],
    select: {
      id: true,
      familyFileId: true,
      usualName: true,
      firstName: true,
      birthName: true,
      fileNumber: true,
      birthDate: true
    }
  })
}
