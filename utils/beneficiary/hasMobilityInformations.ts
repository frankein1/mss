import { Beneficiary } from '@prisma/client'

export function hasMobilityInformations(
  beneficiary: Pick<Beneficiary, 'mobility'>
) {
  return !!beneficiary.mobility
}
