import { SocialSupportStatus } from '@prisma/client'
import { CreateHelpRequestInput, EditHelpRequestInput } from '~/server/schema'

export function cleanUpdateInput({
  input,
  isFinancial
}: {
  input: EditHelpRequestInput
  isFinancial: boolean
}) {
  return cleanInput({
    input,
    isFinancial
  })
}

export function cleanCreateInput(input: CreateHelpRequestInput) {
  const { financialSupport, ...data } = input
  return cleanInput({ input: data, isFinancial: financialSupport })
}

function cleanInput({
  input,
  isFinancial
}: {
  input: Omit<EditHelpRequestInput, 'id' | 'socialSupportId'>
  isFinancial: boolean
}) {
  const {
    status,
    handlingDate,
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
    ...data
  } = input

  const isExternalStructure = externalStructure === 'true'
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
    decisionDate: isAccepted || isRefused ? decisionDate : null,
    handlingDate: isAccepted ? handlingDate : null,
    refusalReason: isRefused ? refusalReason : null,
    dispatchDate: isExternalStructure ? dispatchDate : null,
    examinationDate: !isExternalStructure ? examinationDate : null,
    askedAmount: isFinancial ? askedAmount : null,
    allocatedAmount: isFinancial && isAccepted ? allocatedAmount : null,
    paymentMethod:
      isFinancial && isAccepted && !isExternalStructure ? paymentMethod : null,
    paymentDate:
      isFinancial && isAccepted && !isExternalStructure ? paymentDate : null,
    isRefundable:
      !isFinancial || isRefundable === null || isRefundable === undefined
        ? null
        : isRefundable === 'true'
  }
}
