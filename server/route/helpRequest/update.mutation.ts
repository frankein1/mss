import { StructureType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import {
  SecurityRuleGrantee,
  canCreateInstructorOrganization,
  canCreatePrescribingOrganization,
  getHelpRequestPermissions
} from '~/server/security'
import {
  getHelpRequestWithRelations,
  getHelpRequestSecurityTarget,
  getStructureByUser,
  markFollowupTypeAsUsed
} from '~/server/query'
import { HelpRequestRepo } from '~/server/database'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import {
  connect,
  prepareDocumentsMutations,
  prepareDateFields
} from '~/utils/prisma'

const handler = async ({
  input,
  ctx
}: {
  input: EditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx

  const target = await getHelpRequestWithRelations(user, input.id)

  const {
    id,
    beneficiaryId: _beneficiaryId,
    typeId,
    documents,
    prescribingOrganizationId,
    instructorOrganizationId,
    externalStructure,
    isMinistry: _isMinistry,
    ...otherData
  } = prepareDateFields(input, [
    'decisionDate',
    'dispatchDate',
    'dueDate',
    'examinationDate',
    'handlingDate',
    'paymentDate'
  ])

  let instructorOrganization
  if (instructorOrganizationId) {
    if (isNewOption(instructorOrganizationId)) {
      instructorOrganization = {
        create: {
          name: newOptionToLabel(instructorOrganizationId),
          structureId: user.structureId,
          createdById: user.id
        }
      }
    } else {
      instructorOrganization = connect(instructorOrganizationId)
    }
  }

  let prescribingOrganization
  if (prescribingOrganizationId) {
    if (isNewOption(prescribingOrganizationId)) {
      prescribingOrganization = {
        create: {
          name: newOptionToLabel(prescribingOrganizationId || ''),
          structureId: user.structureId || '',
          createdById: user.id
        }
      }
    } else {
      prescribingOrganization = connect(prescribingOrganizationId)
    }
  }

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id },
    data: {
      type: connect(typeId),
      externalStructure: externalStructure === 'true',
      documents: prepareDocumentsMutations(documents, target.documents),
      instructorOrganization,
      prescribingOrganization,
      ...otherData
    },
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })

  await markFollowupTypeAsUsed([typeId])

  return { helpRequest }
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditHelpRequestInput
) => {
  const [target, structure] = await Promise.all([
    getHelpRequestSecurityTarget(user, input.id),
    getStructureByUser(user)
  ])
  const permissions = getHelpRequestPermissions({ user, target, structure })
  if (!permissions.edit) {
    return false
  }

  const { prescribingOrganizationId, instructorOrganizationId } = input

  if (
    isNewOption(prescribingOrganizationId) &&
    !canCreatePrescribingOrganization(user)
  ) {
    return false
  }
  if (
    isNewOption(instructorOrganizationId) &&
    !canCreateInstructorOrganization(user)
  ) {
    return false
  }

  if (input.privateSynthesis && permissions.set.privateSynthesis) {
    return false
  }

  const { type } = await getStructureByUser(user)
  if (
    (input.numeroPegase || input.ministre) &&
    type !== StructureType.Ministere
  ) {
    return false
  }

  return true
}

export const updateHelpRequestMutation = createMutation({
  securityCheck,
  inputValidation: editHelpRequestSchema,
  handler,
  auditLog: {
    key: 'helpRequest.update',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
