import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHelpRequestInput,
  createHelpRequestSchema
} from '~/server/schema'
import { SecurityRuleGrantee, canCreateHelpRequest } from '~/server/security'
import {
  getBeneficiarySecurityTarget,
  markFollowupTypeAsUsed
} from '~/server/query'
import { HelpRequestRepo } from '~/server/database'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { isNewOption, newOptionToLabel } from '~/utils/options'

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
    financialSupport,
    externalStructure,
    ...otherData
  } = input

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

  const helpRequest = await HelpRequestRepo.prisma.create({
    data: {
      createdBy: connect(user.id),
      beneficiary: connect(beneficiaryId),
      type: connect(typeId),
      structure: connect(structure.id),
      ...otherData,
      financialSupport: financialSupport === 'true',
      externalStructure: externalStructure === 'true',
      documents: prepareDocumentsMutations(input.documents),
      instructorOrganization,
      prescribingOrganization
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
  const beneficiary = await getBeneficiarySecurityTarget(
    user,
    input.beneficiaryId
  )
  return canCreateHelpRequest(user, beneficiary)
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
