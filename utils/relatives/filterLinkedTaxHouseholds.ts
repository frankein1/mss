import { BeneficiaryRelative } from '@prisma/client'

export function filterLinkedTaxHouseholds<
  T extends Partial<Pick<BeneficiaryRelative, 'hosted' | 'linkedBeneficiaryId'>>
>(
  relative: T
): relative is T & {
  hosted: true
  linkedBeneficiaryId: string
} {
  return !!(relative.hosted && relative.linkedBeneficiaryId)
}
