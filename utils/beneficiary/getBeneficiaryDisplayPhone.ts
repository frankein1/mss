import { Beneficiary } from '@prisma/client'

export function getBeneficiaryDisplayPhone(beneficiary: Beneficiary) {
  return beneficiary.phone2
    ? `${beneficiary.phone1} / ${beneficiary.phone2}`
    : beneficiary.phone1
}
