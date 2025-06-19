import { SearchBeneficiaryInput } from '~/server/schema'
import { isReferent, SecurityRuleContext } from '~/server/security'
import { prismaClient } from '~/server/prisma'
import RemoveAccents from 'remove-accents'
import { Beneficiary, Prisma } from '@prisma/client'
import { isAdmin } from '~/server/security/rules/helpers'

type SearchResult = Pick<
  Beneficiary,
  | 'id'
  | 'familyFileId'
  | 'usualName'
  | 'firstName'
  | 'birthName'
  | 'usualName'
  | 'status'
  | 'phone1'
  | 'birthDate'
>

export async function search({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: SearchBeneficiaryInput
}): Promise<SearchResult[]> {
  if (isAdmin(ctx.user)) {
    throw new Error('Beneficiary search is not implemented for admins')
  }
  const isUserReferent = isReferent(ctx.user)
  const constraints = isUserReferent
    ? {
        join: Prisma.sql`INNER JOIN _family_file_referents ON beneficiary.family_file_id=_family_file_referents."A"`,
        where: Prisma.sql`AND _family_file_referents."B"=${ctx.user.id}::uuid`
      }
    : { join: Prisma.empty, where: Prisma.empty }
  const normalized_input = RemoveAccents(input.query).trim().toLowerCase()

  // We need to use a raw SQL query here because Prisma does not support
  // trigram features, which are used here for scoring and fuzzy matching.
  // The downside is we lose type-friendliness, and we need to handle
  // user constraints locally, whereas they are usually automatically
  // added in BeneficiaryRepo
  const results = await prismaClient.$queryRaw<SearchResult[]>`
    SELECT
      id,
      family_file_id AS "familyFileId",
      usual_name AS "usualName",
      first_name AS "firstName",
      birth_name AS "birthName",
      status,
      phone1,
      birth_date AS "birthDate",
      (strict_word_similarity(first_name_normalized, ${normalized_input}) + GREATEST(strict_word_similarity(usual_name_normalized, 
      ${normalized_input}), strict_word_similarity(birth_name_normalized, 
      ${normalized_input}))) AS total_similarity
    FROM beneficiary
    ${constraints.join}
    WHERE
      beneficiary.structure_id=${ctx.user.structureId}::uuid
      ${constraints.where}
      AND (
        -- Optionally, use a stricter threshold
        first_name_normalized % ${normalized_input}
        OR usual_name_normalized % ${normalized_input}
        OR birth_name_normalized % ${normalized_input}
      )
    ORDER BY total_similarity DESC
    LIMIT 10;
  `
  return results
}
