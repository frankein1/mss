import { Beneficiary } from '@prisma/client'

export function getBeneficiaryDisplayPhone(
  beneficiary: Pick<Beneficiary, 'phone1' | 'phone2'> &
    Pick<Beneficiary, 'noPhone'>
) {
  if (beneficiary.noPhone) {
    return 'Pas de téléphone'
  }
  return beneficiary.phone2
    ? `${beneficiary.phone1} / ${beneficiary.phone2}`
    : beneficiary.phone1
}
