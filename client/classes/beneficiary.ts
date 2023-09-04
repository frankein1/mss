import { BeneficiaryStatus } from '@prisma/client'

export const beneficiaryStatusBadgeClasses: {
  [key in BeneficiaryStatus]: string
} = {
  [BeneficiaryStatus.Active]: 'fr-badge--success',
  [BeneficiaryStatus.Inactive]:
    'inactive-status-badge fr-badge--icon-left fr-icon-zzz-line',
  [BeneficiaryStatus.Archived]: 'fr-badge--error',
  [BeneficiaryStatus.Deceased]: 'fr-badge--error'
}
