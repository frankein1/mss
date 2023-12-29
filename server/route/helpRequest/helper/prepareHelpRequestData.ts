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
import { ProtectedAppContext } from '~/server/trpc'
import {
  getHelpRequestPermissions,
  SecurityRuleGrantee
} from '~/server/security'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { prepareNewHistoryElementNotification } from '~/utils/notification'
import { HelpRequestWithRelations } from '~/server/query'

function prepareInstructorOrganization(
  instructorOrganizationId: string | null | undefined,
  user: SecurityRuleGrantee,
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
        structureId: user.structureId,
        createdById: user.id
      }
    }
  }
  return connect(instructorOrganizationId)
}

function preparePrescribingOrganization(
  prescribingOrganizationId: string | null | undefined,
  user: SecurityRuleGrantee
) {
  if (!prescribingOrganizationId) {
    return undefined
  }
  if (isNewOption(prescribingOrganizationId)) {
    return {
      create: {
        name: newOptionToLabel(prescribingOrganizationId || ''),
        structureId: user.structureId || '',
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
  { user, structure }: ProtectedAppContext,
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

  const prescribingOrganization = preparePrescribingOrganization(
    prescribingOrganizationId,
    user
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
      isRefundable === null || isRefundable === undefined
        ? isRefundable
        : isRefundable === 'true'
  }

  const permissions = getHelpRequestPermissions({ user, structure })

  if (permissions.set.ministre) {
    data = { ...data, ministre }
  }
  if (permissions.set.numeroPegase) {
    data = { ...data, numeroPegase }
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
  ctx: ProtectedAppContext,
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
  ctx: ProtectedAppContext,
  target: HelpRequestWithRelations
): Prisma.HelpRequestUpdateInput {
  const data = prepareHelpRequestData(input, ctx, target.subject)
  return {
    ...data,
    documents: prepareDocumentsMutations(documents, target.documents),
    instructorOrganization: prepareInstructorOrganization(
      instructorOrganizationId,
      ctx.user,
      input.externalStructure === 'true',
      target.instructorOrganizationId !== null
    )
  }
}
