import type { BeneficiaryNames } from '~/types/beneficiary'

export function formatBeneficiaryShortenedName(beneficiary: BeneficiaryNames) {
  const firstname = beneficiary.firstName || 'non renseigné'
  const lastname = beneficiary.usualName || beneficiary.birthName || ''
  return `${toFirstLetterUpperCase(firstname)} ${lastname.substring(0, 1)}.`
}
