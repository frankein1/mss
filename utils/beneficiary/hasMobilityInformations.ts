import type { Beneficiary } from '~/prisma/generated/client'

export function hasMobilityInformations(
  beneficiary: Pick<Beneficiary, 'mobility'>
) {
  return !!beneficiary.mobility
}
