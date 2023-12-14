import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHelpRequestInput,
  createHelpRequestSchema
} from '~/server/schema'
import {
  SecurityRuleGrantee,
  getBeneficiaryPermissions
} from '~/server/security'
import {
  getBeneficiarySecurityTarget,
  markFollowupTypeAsUsed,
  getStructureByUser
} from '~/server/query'
import { BeneficiaryRepo, HelpRequestRepo } from '~/server/database'
import {
  connect,
  prepareDocumentsMutations,
  prepareDateFields
} from '~/utils/prisma'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { prepareNewHistoryElementNotification } from '~/utils/notification'

const handler = async ({
  input,
  ctx
}: {
  input: CreateHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx

  const {
    beneficiaryId,
    typeId,
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

  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(user, {
    where: { id: beneficiaryId },
    include: { referents: true }
  })

  const helpRequest = await HelpRequestRepo.prisma.create({
    data: {
      createdBy: connect(user.id),
      beneficiary: connect(beneficiaryId),
      type: connect(typeId),
      structure: connect(structure.id),
      ...otherData,
      externalStructure: externalStructure === 'true',
      documents: prepareDocumentsMutations(input.documents),
      instructorOrganization,
      prescribingOrganization,
      notifications: prepareNewHistoryElementNotification(beneficiary, user)
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
  input: CreateHelpRequestInput
) => {
  const [target, structure] = await Promise.all([
    getBeneficiarySecurityTarget(user, input.beneficiaryId),
    getStructureByUser(user)
  ])
  const permissions = getBeneficiaryPermissions({ user, structure, target })
  return permissions.create.helpRequest
}

export const createHelpRequestMutation = createMutation({
  handler,
  inputValidation: createHelpRequestSchema,
  securityCheck,
  auditLog: {
    key: 'helpRequest.create',
    target: 'HelpRequest',
    targetId: ({ routeResult }) => {
      return routeResult.helpRequest.id
    },
    action: UserActivityType.CREATE
  }
})
