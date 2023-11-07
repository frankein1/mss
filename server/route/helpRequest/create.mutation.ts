import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHelpRequestInput,
  createHelpRequestSchema
} from '~/server/schema'
import {
  SecurityRuleGrantee,
  canCreateHelpRequest
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import { HelpRequestRepo } from '~/server/database'

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
      instructorOrganization = {
        connect: {
          id: instructorOrganizationId
        }
      }
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
      prescribingOrganization = {
        connect: {
          id: prescribingOrganizationId
        }
      }
    }
  }

  const helpRequest = await HelpRequestRepo.prisma.create({
    data: {
      createdBy: {
        connect: {
          id: user.id
        }
      },
      beneficiary: {
        connect: {
          id: beneficiaryId
        }
      },
      type: {
        connect: {
          id: typeId
        }
      },
      structure: {
        connect: {
          id: structure.id
        }
      },
      ...otherData,
      financialSupport: financialSupport === 'true',
      externalStructure: externalStructure === 'true',
      documents: prepareDocumentsMutations(input.documents, []),
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
