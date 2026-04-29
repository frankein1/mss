import { SocialSupportStatus } from '@prisma/client'
import type {
  CreateHelpRequestServerInput,
  EditHelpRequestServerInput
} from '~/server/schema'

export function cleanUpdateInput({
  input,
  isFinancial
}: {
  input: EditHelpRequestServerInput
  isFinancial: boolean
}) {
  return cleanInput({
    input,
    isFinancial
  })
}

export function cleanCreateInput(input: CreateHelpRequestServerInput) {
  const { financialSupport, ...data } = input
  return cleanInput({ input: data, isFinancial: financialSupport })
}

function cleanInput({
  input,
  isFinancial
}: {
  input: Omit<EditHelpRequestServerInput, 'id' | 'socialSupportId'>
  isFinancial: boolean
}) {
  const {
    status,
    refusalReason,
    dispatchDate,
    decisionDate,
    examinationDate,
    askedAmount,
    allocatedAmount,
    paymentMethod,
    paymentDate,
    externalStructure,
    isRefundable,
    instructorOrganizationId,
    instructorOrganizationContactId,
    ...data
  } = input

  const isExternalStructure = externalStructure
  const isAccepted = status === SocialSupportStatus.Accepted
  const isRefused = status === SocialSupportStatus.Refused

  return {
    ...data,
    status,
    financialSupport: isFinancial,
    externalStructure: isExternalStructure,
    instructorOrganizationId: isExternalStructure
      ? instructorOrganizationId
      : null,
    instructorOrganizationContactId: instructorOrganizationId
      ? instructorOrganizationContactId
      : null,
    decisionDate: isAccepted || isRefused ? decisionDate : null,
    refusalReason: isRefused ? refusalReason : null,
    dispatchDate: isExternalStructure ? dispatchDate : null,
    examinationDate: !isExternalStructure ? examinationDate : null,
    askedAmount: isFinancial ? askedAmount : null,
    allocatedAmount: isFinancial && isAccepted ? allocatedAmount : null,
    paymentMethod:
      isFinancial && isAccepted && !isExternalStructure ? paymentMethod : null,
    paymentDate:
      isFinancial && isAccepted && !isExternalStructure ? paymentDate : null,
    isRefundable: !isFinancial ? null : isRefundable
  }
}
