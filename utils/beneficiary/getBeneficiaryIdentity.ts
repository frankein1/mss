import { beneficiaryTitleLabels } from '~/client/options/beneficiary'
import type { GetBeneficiaryOutput } from '~/server/routers'

export function getBeneficiaryIdentity(beneficiary: GetBeneficiaryOutput) {
  return `${
    beneficiary.title ? `${beneficiaryTitleLabels[beneficiary.title]} ` : ''
  }${beneficiary.usualName ? `${beneficiary.usualName} ` : ''}${nameOrEmpty(
    beneficiary.firstName
  )}`
}
