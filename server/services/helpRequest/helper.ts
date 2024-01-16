import { HelpRequestSubject, Prisma, SocialSupportStatus } from '@prisma/client'
import {
  CreateHelpRequestInput,
  EditHelpRequestInput,
  HelpRequestFilterInput
} from '~/server/schema'
import { connect } from '~/utils/prisma'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { SecurityRuleContext } from '~/server/security/rules/types'

export function prepareInstructorOrganization(
  instructorOrganizationId: string | null | undefined,
  ctx: SecurityRuleContext,
  isExternalStructure: boolean,
  hasInstructorOrganizationAlreadySelected = false
) {
  if (!isExternalStructure) {
    return undefined
  }
  if (!instructorOrganizationId) {
    return hasInstructorOrganizationAlreadySelected
      ? { disconnect: true }
      : undefined
  }
  if (isNewOption(instructorOrganizationId)) {
    return {
      create: {
        name: newOptionToLabel(instructorOrganizationId),
        structureId: ctx.structure.id,
        createdById: ctx.user.id
      }
    }
  }
  return connect(instructorOrganizationId)
}

export function preparePrescribingOrganization(
  prescribingOrganizationId: string | null | undefined,
  ctx: SecurityRuleContext
) {
  if (!prescribingOrganizationId) {
    return undefined
  }
  if (isNewOption(prescribingOrganizationId)) {
    return {
      create: {
        name: newOptionToLabel(prescribingOrganizationId),
        structureId: ctx.structure.id,
        createdById: ctx.user.id
      }
    }
  }
  return connect(prescribingOrganizationId)
}

export function prepareFilters(filters: HelpRequestFilterInput) {
  const formattedFilters: Prisma.HelpRequestWhereInput = {}
  formattedFilters.socialSupport = {}

  if (filters.status) {
    formattedFilters.socialSupport.status = filters.status
  }

  if (filters.followupTypes) {
    formattedFilters.socialSupport.types = {
      some: { id: { in: filters.followupTypes } }
    }
  }

  if (filters.examinationDate) {
    formattedFilters.examinationDate = filters.examinationDate
  }

  if (filters.handlingDate !== undefined) {
    formattedFilters.handlingDate =
      filters.handlingDate === 'true' ? { not: null } : null
  }

  if (filters.externalStructure !== undefined) {
    formattedFilters.externalStructure = filters.externalStructure === 'true'
  }

  if (filters.referents) {
    formattedFilters.socialSupport = {
      beneficiary: {
        referents: { some: { id: { in: filters.referents } } }
      }
    }
  }

  if (filters.ministre) {
    formattedFilters.socialSupport = { ministre: { in: filters.ministre } }
  }

  return formattedFilters
}

export function cleanUpdateInput({
  input,
  subject
}: {
  input: EditHelpRequestInput
  subject: HelpRequestSubject
}) {
  return cleanInput({ input, subject })
}

export function cleanCreateInput(input: CreateHelpRequestInput) {
  const { subject, ...data } = input
  return cleanInput({ input: data, subject })
}

function cleanInput({
  input,
  subject
}: {
  input: Omit<EditHelpRequestInput, 'id' | 'socialSupportId'>
  subject: HelpRequestSubject
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
    ...data
  } = input

  const isExternalStructure = externalStructure === 'true'
  const isFinancial = subject === HelpRequestSubject.Financial
  const isAccepted = status === SocialSupportStatus.Accepted
  const isRefused = status === SocialSupportStatus.Refused

  return {
    ...data,
    status,
    subject,
    externalStructure: isExternalStructure,
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
