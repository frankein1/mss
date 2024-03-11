import { Beneficiary } from '@prisma/client'
import { calculateAge } from './calculateAge'

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
    const age = calculateAge(info.birthDate)
    res.push(`(${age} an${age > 1 ? 's' : ''})`)
  }
  if (info.birthPlace) {
    res.push('à')
    res.push(info.birthPlace)
  }
  return res.join(' ')
}
