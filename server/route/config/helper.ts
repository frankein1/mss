import {
  SecurityRuleGrantee,
  canOnlyListItsBeneficiaries
} from '~/server/security'

export function prepareExaminationDatesBeneficiaryCondition(
  beneficiaryId: string | undefined,
  user: SecurityRuleGrantee
) {
  if (beneficiaryId) {
    return { id: beneficiaryId }
  }
  if (canOnlyListItsBeneficiaries(user)) {
    return { referents: { some: { id: user.id } } }
  }
  return undefined
}

export function hasDefinedExaminationDate(h: {
  examinationDate: Date | null
}): h is { examinationDate: Date } {
  return h.examinationDate !== null
}
