import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SupportProgramStatFilterInput } from '~~/server/schema'
import { supportProgramStatFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramRepo } from '~~/server/database'
import { prepareSupportProgramStatFilters } from '~~/server/query/stats/helpers'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SupportProgramStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getSupportProgramNames(input, ctx)
}

/**
 * Distinct beneficiaries per support program name.
 * A beneficiary can be counted for several support programs, so `total` is the
 * number of distinct beneficiaries and not the sum of support program counts.
 */
export const getSupportProgramNames = async (
  input: SupportProgramStatFilterInput,
  { user }: ProtectedAppContext
) => {
  const supportPrograms = await SupportProgramRepo.findMany(user, {
    select: {
      beneficiaryId: true,
      supportProgramName: { select: { id: true, name: true } }
    },
    where: prepareSupportProgramStatFilters(input)
  })

  const names = new Map<
    string,
    { id: string; name: string; beneficiaryIds: Set<string> }
  >()

  for (const { beneficiaryId, supportProgramName } of supportPrograms) {
    const item = names.get(supportProgramName.id) ?? {
      ...supportProgramName,
      beneficiaryIds: new Set<string>()
    }
    item.beneficiaryIds.add(beneficiaryId)
    names.set(supportProgramName.id, item)
  }

  return {
    total: new Set(supportPrograms.map(sp => sp.beneficiaryId)).size,
    supportProgramNames: [...names.values()]
      .map(({ id, name, beneficiaryIds }) => ({
        id,
        name,
        _count: beneficiaryIds.size
      }))
      .sort((a, b) => b._count - a._count || a.name.localeCompare(b.name, 'fr'))
  }
}

export const getSupportProgramNameStatsQuery = createQuery({
  inputValidation: supportProgramStatFilterSchema,
  securityCheck,
  handler
})
