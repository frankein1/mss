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
import { getHelpRequestPermissions } from '~/server/security'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { prepareNewHistoryElementNotification } from '~/utils/notification'
import { HelpRequestWithRelations } from '~/server/query'

function prepareInstructorOrganization(
  instructorOrganizationId: string | null | undefined,
  user: ProtectedAppContext['user']
) {
  if (!instructorOrganizationId) {
    return undefined
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
  user: ProtectedAppContext['user']
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
  input: CreateHelpRequestInput | Omit<EditHelpRequestInput, 'id'>,
  { user, structure }: ProtectedAppContext,
  subject: HelpRequestSubject
) {
  const {
    beneficiaryId: _beneficiaryId,
    typeId,
    prescribingOrganizationId,
    instructorOrganizationId,
    externalStructure,
    isMinistry: _isMinistry,
    ministre,
    numeroPegase,
    dispatchDate,
    examinationDate,
    decisionDate,
    status,
    handlingDate,
    refusalReason,
    subject: _subject,
    documents: _documents,
    askedAmount,
    allocatedAmount,
    paymentMethod,
    paymentDate,
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

  let data: Omit<
    Prisma.HelpRequestCreateInput,
    'createdBy' | 'beneficiary' | 'structure' | 'subject' | 'documents'
  > &
    Omit<Prisma.HelpRequestUpdateInput, 'id'> = {
    type: connect(typeId),
    status,
    ...otherData,
    externalStructure: isExternalStructure,
    prescribingOrganization
  }

  const permissions = getHelpRequestPermissions({ user, structure })

  if (permissions.set.ministre) {
    data = { ...data, ministre }
  }
  if (permissions.set.numeroPegase) {
    data = { ...data, numeroPegase }
  }

  if (isExternalStructure) {
    const instructorOrganization = prepareInstructorOrganization(
      instructorOrganizationId,
      user
    )
    data = { ...data, instructorOrganization, dispatchDate }

    if (status === HelpRequestStatus.Accepted) {
      data = { ...data, decisionDate, handlingDate }
    } else if (status === HelpRequestStatus.Refused) {
      data = { ...data, decisionDate, refusalReason }
    }
  } else if (externalStructure !== undefined) {
    data = { ...data, examinationDate }
  }

  if (
    subject === HelpRequestSubject.Financial &&
    externalStructure !== undefined
  ) {
    data = { ...data, askedAmount }

    if (status === HelpRequestStatus.Accepted) {
      data = { ...data, allocatedAmount }
    }
    if (!isExternalStructure) {
      data = { ...data, paymentMethod, paymentDate }
    }
  }

  return data
}

export function prepareHelpRequestCreateData(
  input: CreateHelpRequestInput,
  ctx: ProtectedAppContext,
  beneficiary: Pick<Beneficiary, 'id'> & { referents: { id: string }[] }
): Prisma.HelpRequestCreateInput {
  const data = prepareHelpRequestData(input, ctx, input.subject)
  return {
    ...data,
    createdBy: connect(ctx.user.id),
    beneficiary: connect(input.beneficiaryId),
    structure: connect(ctx.structure.id),
    subject: input.subject,
    notifications: prepareNewHistoryElementNotification(beneficiary, ctx.user),
    documents: prepareDocumentsMutations(input.documents)
  }
}

export function prepareHelpRequestUpdateData(
  { id: _id, ...input }: EditHelpRequestInput,
  ctx: ProtectedAppContext,
  target: HelpRequestWithRelations
): Prisma.HelpRequestUpdateInput {
  const data = prepareHelpRequestData(input, ctx, target.subject)
  return {
    ...data,
    documents: prepareDocumentsMutations(input.documents, target.documents)
  }
}
