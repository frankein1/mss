import { StructureType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import {
  SecurityRuleGrantee,
  canCreateInstructorOrganization,
  canCreatePrescribingOrganization,
  canEditHelpRequest,
  canEditHelpRequestPrivateSynthesis
} from '~/server/security/rules'
import { prepareDocumentsMutations } from '~/utils/document/prepareDocumentMutations'
import {
  getHelpRequestWithRelations,
  getHelpRequestsecurityTarget
} from '~/server/query'
import { HelpRequestRepo, StructureRepo } from '~/server/database'
import { isNewOption } from '~/utils/options'

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

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id },
    data: {
      type: {
        connect: {
          id: typeId
        }
      },
      financialSupport: financialSupport === 'true',
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

  return { helpRequest }
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditHelpRequestInput
) => {
  const target = await getHelpRequestsecurityTarget(user, input.id)
  if (!canEditHelpRequest(user, target)) {
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

  if (
    input.privateSynthesis &&
    !canEditHelpRequestPrivateSynthesis(user, target)
  ) {
    return false
  }

  const { type } = await StructureRepo.findUniqueOrThrow(user, {
    where: {
      id: user.structureId || ''
    },
    select: {
      type: true
    }
  })
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
