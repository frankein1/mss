import { Beneficiary } from '@prisma/client'

export function beneficiaryName(
  beneficiary: Pick<Beneficiary, 'firstName' | 'usualName' | 'birthName'>
): string {
  let lastname = ''
  if (beneficiary.usualName) lastname = beneficiary.usualName
  else if (beneficiary.birthName) lastname = `(${beneficiary.birthName})`
  return `${nameOrEmpty(beneficiary.firstName)} ${nameOrEmpty(
    lastname.toUpperCase()
  )}`
}

export function nameOrEmpty(name: string | null): string {
  return name || '(non renseigné)'
}

export function beneficiaryToSearchResult(
  beneficiary: Pick<
    Beneficiary,
    'firstName' | 'usualName' | 'birthName' | 'birthDate'
  >
): string {
  const name = beneficiaryName(beneficiary)
  const birthDate = beneficiary.birthDate
    ? formatDate(beneficiary.birthDate)
    : ''
  return birthDate ? `${name} (${birthDate})` : name
}
