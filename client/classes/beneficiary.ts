import type { DsfrBadgeProps } from '@gouvminint/vue-dsfr'
import { BeneficiaryStatus } from '~/prisma/generated/browser'

export const beneficiaryStatusBadgeType: Record<
  BeneficiaryStatus,
  Extract<DsfrBadgeProps['type'], 'success' | 'warning' | 'error'>
> = {
  [BeneficiaryStatus.Active]: 'success',
  [BeneficiaryStatus.Inactive]: 'warning',
  [BeneficiaryStatus.Archived]: 'error',
  [BeneficiaryStatus.Deceased]: 'error'
}
