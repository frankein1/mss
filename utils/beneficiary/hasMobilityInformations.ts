import type { Beneficiary } from '~/prisma/generated/browser'

export function hasMobilityInformations(
  beneficiary: Pick<Beneficiary, 'mobility'>
) {
  return !!beneficiary.mobility
}
