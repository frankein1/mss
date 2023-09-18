import { Beneficiary } from '@prisma/client'

export function formatBeneficiaryBirthInfo(
  info: Pick<Beneficiary, 'birthDate' | 'birthPlace'>
) {
  if (!info.birthDate && !info.birthPlace) {
    return ''
  }
  const res = ['Né(e)']
  if (info.birthDate) {
    res.push('le')
    res.push(formatDate(info.birthDate))
  }
  if (info.birthPlace) {
    res.push('à')
    res.push(info.birthPlace)
  }
  return res.filter(Boolean).join(' ')
}
