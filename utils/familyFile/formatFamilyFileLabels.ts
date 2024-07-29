import { BeneficiaryFileIdentification } from '~/types/beneficiary'
import { relativeRelationshipKeys } from '~/client/options/beneficiary'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'

function formatAge(m: BeneficiaryFileIdentification) {
  if (!m.birthDate) {
    return ''
  }

  const age = Math.floor(
    (new Date().getTime() - m.birthDate.getTime()) / 1000 / 3600 / 24 / 365.24
  )
  const unite = age > 1 ? 'ans' : 'an'

  return `${age} ${unite}`
}

function formatRelationship(m: BeneficiaryFileIdentification) {
  return relativeRelationshipKeys.value(m.relationship)?.toLocaleLowerCase()
}

export function formatFamilyFileLabels(
  familyFileIdentification: BeneficiaryFileIdentification[]
) {
  const spouses = familyFileIdentification
    .filter(m => m.relationship === 'Conjoint' || !m.relationship)
    .map(m => {
      const age = m.birthDate ? ` (${formatAge(m)})` : ''
      return `${formatBeneficiaryDisplayName(m)}` + age
    })

  const other = familyFileIdentification
    .filter(m => m.relationship !== 'Conjoint' && m.relationship)
    .map(
      m =>
        `${formatBeneficiaryDisplayName(m)} (${formatRelationship(m)} ${formatAge(m)})`
    )

  return { spouses, other }
}
