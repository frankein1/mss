import type { SecurityRuleContext } from '~~/server/security'
import { FamilyFileRepo } from '~~/server/database'

export async function getMembersAccommodation({
  ctx,
  input: { id, beneficiaryId }
}: {
  ctx: SecurityRuleContext
  input: { id: string; beneficiaryId: string }
}) {
  const familyFile = await FamilyFileRepo.findUniqueOrThrow(ctx.user, {
    where: { id },
    select: {
      beneficiaries: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          accommodationMode: true,
          accommodationName: true,
          accommodationAdditionalInformation: true,
          street: true,
          addressComplement: true,
          zipcode: true,
          city: true,
          department: true,
          region: true,
          qpv: true,
          accommodationZone: true
        },
        orderBy: { created: 'asc' }
      }
    }
  })

  return familyFile.beneficiaries.filter(
    m =>
      m.id !== beneficiaryId &&
      (m.accommodationMode || m.street || m.city || m.zipcode)
  )
}
