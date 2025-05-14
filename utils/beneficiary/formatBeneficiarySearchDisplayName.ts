import { BeneficiaryIdentification } from '~/types/beneficiary'

export function formatBeneficiarySearchDisplayName(
  beneficiary: BeneficiaryIdentification
): string {
  const { firstName, usualName, birthName } = beneficiary
  if (usualName && birthName) {
    return `${usualName.toUpperCase()} (${birthName.toUpperCase()}) ${firstName}`
  }
  if (!usualName && birthName) {
    return `${birthName.toUpperCase()} ${firstName}`
  }
  if (usualName && !birthName) {
    return `${usualName.toUpperCase()} ${firstName}`
  }
  return firstName ?? ''
}
