import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import { getHelpRequestWithRelations } from '~/server/query'
import { HelpRequestRepo } from '~/server/database'
import { isNewOption, newOptionToLabel } from '~/utils/options'
import { connect, prepareDocumentsMutations } from '~/utils/prisma'
import { appRouter } from '~/server/trpc/routers'
import { SecurityRuleGrantee } from '~/server/security'

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
  const caller = appRouter.createCaller({})
  const permissions = await caller.permissions.getHelpRequestPermissions({
    beneficiaryId: input.beneficiaryId,
    targetId: input.id
  })

  const {
    actions: { edit, createPrescribingOrga, createInstructorOrga },
    fields: { privateSynthesis, numeroPegase, ministre }
  } = permissions

  if (!edit) {
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
