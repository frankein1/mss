import type { GetBeneficiaryOutput } from '~/server/routers'

export function hasIdentityInformations(beneficiary: GetBeneficiaryOutput) {
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
    beneficiary.numeroPegase ||
    beneficiary.caregiver
  )
}

export function hasAddressInformations(beneficiary: GetBeneficiaryOutput) {
  return (
    beneficiary.accommodationMode ||
    beneficiary.accommodationAdditionalInformation ||
    beneficiary.accommodationZone ||
    beneficiary.street ||
    beneficiary.streetNumber ||
    beneficiary.zipcode ||
    beneficiary.city ||
    beneficiary.addressComplement ||
    beneficiary.region
  )
}

export function hasMobilityInformations(beneficiary: GetBeneficiaryOutput) {
  return !!beneficiary.mobility
}

export function hasAdditionalInformations(beneficiary: GetBeneficiaryOutput) {
  return !!beneficiary.additionalInformation
}

export function hasGeneralInformations(beneficiary: GetBeneficiaryOutput) {
  return (
    hasIdentityInformations(beneficiary) ||
    hasAddressInformations(beneficiary) ||
    hasMobilityInformations(beneficiary) ||
    hasAdditionalInformations(beneficiary)
  )
}
