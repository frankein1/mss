import { Beneficiary } from '@prisma/client'

export function formatBeneficiaryDisplayPhone(
  beneficiary: Pick<Beneficiary, 'phone1' | 'phone2'>
) {
  return beneficiary.phone2
    ? `${beneficiary.phone1} / ${beneficiary.phone2}`
    : beneficiary.phone1
}
