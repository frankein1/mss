import { BeneficiaryStatus } from '@prisma/client'

export const beneficiaryStatusBadgeClasses: {
  [key in BeneficiaryStatus]: string
} = {
  [BeneficiaryStatus.Active]: 'fr-badge--success',
  [BeneficiaryStatus.Inactive]: 'fr-badge--warning',
  [BeneficiaryStatus.Archived]: 'fr-badge--error',
  [BeneficiaryStatus.Deceased]: 'fr-badge--error'
}
