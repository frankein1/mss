import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SupportProgramStatFilterInput } from '~~/server/schema'
import { supportProgramStatFilterSchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramRepo } from '~~/server/database'
import { prepareSupportProgramStatFilters } from '~~/server/query/stats/helpers'
import { STATS_NULL_KEY } from '~/utils/constants/stats'

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx
}: {
  input: SupportProgramStatFilterInput
  ctx: ProtectedAppContext
}) => {
  return getSupportProgramPartners(input, ctx)
}

/**
 * Distinct beneficiaries per partner organization.
 * A beneficiary can be counted for several partners, so `total` is the number
 * of distinct beneficiaries and not the sum of partner counts.
 */
export const getSupportProgramPartners = async (
  input: SupportProgramStatFilterInput,
  { user }: ProtectedAppContext
) => {
  const supportPrograms = await SupportProgramRepo.findMany(user, {
    select: {
      beneficiaryId: true,
      partnerOrganisations: { select: { id: true, name: true } }
    },
    where: prepareSupportProgramStatFilters(input)
  })

  const partners = new Map<
    string,
    { id: string | null; name: string | null; beneficiaryIds: Set<string> }
  >()
  const addBeneficiary = (
    id: string | null,
    name: string | null,
    beneficiaryId: string
  ) => {
    const key = id ?? STATS_NULL_KEY
    const partner = partners.get(key) ?? {
      id,
      name,
      beneficiaryIds: new Set<string>()
    }
    partner.beneficiaryIds.add(beneficiaryId)
    partners.set(key, partner)
  }

  for (const { beneficiaryId, partnerOrganisations } of supportPrograms) {
    if (!partnerOrganisations.length) {
      addBeneficiary(null, null, beneficiaryId)
    }
    for (const { id, name } of partnerOrganisations) {
      addBeneficiary(id, name, beneficiaryId)
    }
  }

  return {
    total: new Set(supportPrograms.map(sp => sp.beneficiaryId)).size,
    partners: [...partners.values()]
      .map(({ id, name, beneficiaryIds }) => ({
        id,
        name,
        _count: beneficiaryIds.size
      }))
      .sort((a, b) => {
        // Not filled always comes last
        if (a.id === null || b.id === null) {
          return Number(a.id === null) - Number(b.id === null)
        }
        return (
          b._count - a._count ||
          (a.name ?? '').localeCompare(b.name ?? '', 'fr')
        )
      })
  }
}

export const getSupportProgramPartnerStatsQuery = createQuery({
  inputValidation: supportProgramStatFilterSchema,
  securityCheck,
  handler
})
