import { Prisma, SocialSupportStatus } from '@prisma/client'
import {
  CreateHelpRequestInput,
  EditHelpRequestInput,
  HelpRequestFilterInput,
  ExportHelpRequestsInput
} from '~/server/schema'
import { connect } from '~/utils/prisma'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { SortOrder } from '~/types/table'

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

  const {
    status,
    followupTypes,
    examinationDate,
    handlingDate,
    externalStructure,
    referents,
    ministre
  } = filters

  if (handlingDate) {
    formattedFilters.handlingDate =
      handlingDate === 'true' ? { not: null } : null
  }

  if (examinationDate || externalStructure) {
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}

    if (examinationDate) {
      formattedFilters.fileInstruction.examinationDate = examinationDate
    }

    if (externalStructure !== undefined) {
      formattedFilters.fileInstruction.externalStructure =
        externalStructure === 'true'
    }
  }

  if (status || followupTypes || referents || ministre) {
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.socialSupport =
      formattedFilters.fileInstruction.socialSupport || {}

    if (status) {
      formattedFilters.fileInstruction.socialSupport.status = status
    }

    if (followupTypes) {
      formattedFilters.fileInstruction.socialSupport.types = {
        some: { id: { in: followupTypes } }
      }
    }

    if (referents) {
      formattedFilters.fileInstruction.socialSupport = {
        beneficiary: {
          referents: { some: { id: { in: referents } } }
        }
      }
    }

    if (ministre) {
      formattedFilters.fileInstruction.socialSupport = {
        ministre: { in: ministre }
      }
    }
  }

  return formattedFilters
}

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

export function prepareSort(sort: ExportHelpRequestsInput['orderBy']) {
  const orderBy: Prisma.HelpRequestFindManyArgs['orderBy'] = [sort]

  if (sort.fileInstruction?.socialSupport?.date) {
    orderBy.push({
      fileInstruction: { socialSupport: { created: SortOrder.Desc } }
    })
  }

  if (sort.fileInstruction?.instructorOrganization) {
    orderBy.unshift({ fileInstruction: { externalStructure: SortOrder.Desc } })
  }

  return orderBy
}
