import { Beneficiary } from '@prisma/client'

export function hasIdentityInformations(
  beneficiary: Pick<
    Beneficiary,
    | 'title'
    | 'usualName'
    | 'firstName'
    | 'birthDate'
    | 'birthPlace'
    | 'gender'
    | 'birthName'
    | 'deathDate'
    | 'numeroPegase'
    | 'nationality'
  >
) {
  return (
    beneficiary.title ||
    beneficiary.usualName ||
    beneficiary.firstName ||
    beneficiary.birthDate ||
    beneficiary.birthPlace ||
    beneficiary.gender ||
    beneficiary.birthName ||
    beneficiary.nationality ||
    beneficiary.deathDate ||
    beneficiary.numeroPegase
  )
}
