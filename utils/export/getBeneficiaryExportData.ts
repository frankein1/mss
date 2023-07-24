import { inferAsyncReturnType } from '@trpc/server'
import {
  beneficiaryStatusLabels,
  beneficiaryTitleLabels
} from '~/client/options/beneficiary'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'
import { getBooleanOrEmpty } from '~/utils/export/getBooleanOrEmpty'
import { formatDate } from '~/utils/formatDate'
import { readableFileNumber } from '~/utils/readableFileNumber'
import { getUserDisplayName } from '~/utils/user'

export function getBeneficiaryExportData(
  beneficiary: inferAsyncReturnType<typeof getBeneficiaryAccessibleData>
) {
  return {
    id: beneficiary.beneficiary.id,
    referents: beneficiary.beneficiary.referents
      .map(referent => getUserDisplayName(referent))
      .join(','),
    aidantConnectAuthorized: getBooleanOrEmpty(
      beneficiary.beneficiary.aidantConnectAuthorized
    ),
    fileNumber: readableFileNumber(beneficiary.beneficiary.id),
    status: beneficiaryStatusLabels[beneficiary.beneficiary.status],
    title: beneficiary.beneficiary.title
      ? beneficiaryTitleLabels[beneficiary.beneficiary.title]
      : '',
    usualName: beneficiary.beneficiary.usualName || '',
    birthName: beneficiary.beneficiary.birthName || '',
    firstName: beneficiary.beneficiary.firstName || '',
    birthDate: formatDate(beneficiary.beneficiary.birthDate, 'DD-MM-YYYY'),
    birthPlace: beneficiary.beneficiary.birthPlace || '',
    deathDate: formatDate(beneficiary.beneficiary.deathDate, 'DD-MM-YYYY')
  }
}
