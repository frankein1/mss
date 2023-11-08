import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  CreateHelpRequestInput,
  createHelpRequestSchema
} from '~/server/schema'
import { HelpRequestRepo } from '~/server/database'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { appRouter } from '~/server/trpc/routers'
import { SecurityRuleGrantee } from '~/server/security'

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

  return { helpRequest }
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: CreateHelpRequestInput
) => {
  const caller = appRouter.createCaller({})
  const permissions = await caller.permissions.getHelpRequestPermissions({
    beneficiaryId: input.beneficiaryId
  })

  const {
    actions: { create, createPrescribingOrga, createInstructorOrga },
    fields: { privateSynthesis, numeroPegase, ministre }
  } = permissions

  if (!create) {
    return false
  }

  const { prescribingOrganizationId, instructorOrganizationId } = input

  if (isNewOption(prescribingOrganizationId) && !createPrescribingOrga) {
    return false
  }
  if (isNewOption(instructorOrganizationId) && !createInstructorOrga) {
    return false
  }

  if (input.privateSynthesis && !privateSynthesis) {
    return false
  }

  if (input.numeroPegase && !numeroPegase) {
    return false
  }

  if (input.ministre && !ministre) {
    return false
  }

  return true
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
