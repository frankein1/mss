import {
  Prisma,
  HelpRequestStatus,
  HelpRequestSubject,
  Beneficiary
} from '@prisma/client'
import { CreateHelpRequestInput, EditHelpRequestInput } from '~/server/schema'
import {
  connect,
  prepareDateFields,
  prepareDocumentsMutations
} from '~/utils/prisma'
import {
  getHelpRequestPermissions,
  SecurityRuleGrantee
} from '~/server/security'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { HelpRequestWithRelations } from '~/server/query'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { prepareNewHistoryElementNotification } from '~/server/services/helper'

function prepareInstructorOrganization(
  instructorOrganizationId: string | null | undefined,
  user: SecurityRuleGrantee,
  structureId: string,
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
        structureId,
        createdById: user.id
      }
    }
  }
  return connect(instructorOrganizationId)
}

function preparePrescribingOrganization(
  prescribingOrganizationId: string | null | undefined,
  user: SecurityRuleGrantee,
  structureId: string
) {
  if (!prescribingOrganizationId) {
    return undefined
  }
  if (isNewOption(prescribingOrganizationId)) {
    return {
      create: {
        name: newOptionToLabel(prescribingOrganizationId),
        structureId,
        createdById: user.id
      }
    }
  }
  return connect(prescribingOrganizationId)
}

function prepareHelpRequestData(
  input: Omit<
    | CreateHelpRequestInput
    | Omit<EditHelpRequestInput, 'id' | 'beneficiaryId' | 'subject'>,
    'isMinistry' | 'documents' | 'instructorOrganizationId'
  >,
  ctx: SecurityRuleContext,
  subject: HelpRequestSubject
) {
  const {
    typeId,
    prescribingOrganizationId,
    externalStructure,
    ministre,
    numeroPegase,
    dispatchDate,
    examinationDate,
    decisionDate,
    status,
    handlingDate,
    refusalReason,
    askedAmount,
    allocatedAmount,
    paymentMethod,
    paymentDate,
    isRefundable,
    ...otherData
  } = prepareDateFields(input, [
    'decisionDate',
    'dispatchDate',
    'dueDate',
    'examinationDate',
    'handlingDate',
    'paymentDate'
  ])

  const { user, structure } = ctx

  const prescribingOrganization = preparePrescribingOrganization(
    prescribingOrganizationId,
    user,
    structure.id
  )
  const isExternalStructure = externalStructure === 'true'
  const isFinancial = subject === HelpRequestSubject.Financial
  const isAccepted = status === HelpRequestStatus.Accepted
  const isRefused = status === HelpRequestStatus.Refused

  let data: Omit<
    Prisma.HelpRequestCreateInput,
    'createdBy' | 'beneficiary' | 'structure' | 'subject' | 'documents'
  > &
    Omit<Prisma.HelpRequestUpdateInput, 'id'> = {
    type: connect(typeId),
    status,
    ...otherData,
    externalStructure: isExternalStructure,
    prescribingOrganization,
    isRefundable:
      !isFinancial || isRefundable === null || isRefundable === undefined
        ? null
        : isRefundable === 'true'
  }

  const permissions = getHelpRequestPermissions({ ctx })

  if (permissions.set.ministre) {
    data = { ...data, ministre }
  }
  if (permissions.set.numeroPegase) {
    data = { ...data, numeroPegase }
  }
  if (isRefused && refusalReason) {
    data = { ...data, refusalReasonOther: null }
  }

  // It is required to enforce setting undefined when conditional field is not available to allow overriding in edit mode
  data = {
    ...data,
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
      isFinancial && isAccepted && !isExternalStructure ? paymentDate : null
  }

  return data
}

export function prepareHelpRequestCreateData(
  {
    isMinistry: _isMinistry, // This field is ignored as only used for schema validation
    beneficiaryId,
    subject,
    documents,
    instructorOrganizationId,
    ...input
  }: CreateHelpRequestInput,
  ctx: SecurityRuleContext,
  beneficiary: Pick<Beneficiary, 'id'> & { referents: { id: string }[] }
): Prisma.HelpRequestCreateInput {
  const data = prepareHelpRequestData(input, ctx, subject)
  return {
    ...data,
    createdBy: connect(ctx.user.id),
    beneficiary: connect(beneficiaryId),
    structure: connect(ctx.structure.id),
    subject,
    notifications: prepareNewHistoryElementNotification(beneficiary, ctx.user),
    documents: prepareDocumentsMutations(documents),
    instructorOrganization: prepareInstructorOrganization(
      instructorOrganizationId,
      ctx.user,
      ctx.structure.id,
      input.externalStructure === 'true'
    )
  }
}

export function prepareHelpRequestUpdateData(
  {
    documents,
    // Following fields are ignored in edition
    id: _id,
    isMinistry: _isMinistry,
    beneficiaryId: _beneficiaryId,
    instructorOrganizationId,
    ...input
  }: EditHelpRequestInput,
  ctx: SecurityRuleContext,
  target: HelpRequestWithRelations
): Prisma.HelpRequestUpdateInput {
  const data = prepareHelpRequestData(input, ctx, target.subject)
  return {
    ...data,
    documents: prepareDocumentsMutations(documents, target.documents),
    instructorOrganization: prepareInstructorOrganization(
      instructorOrganizationId,
      ctx.user,
      ctx.structure.id,
      input.externalStructure === 'true',
      target.instructorOrganizationId !== null
    )
  }
}
