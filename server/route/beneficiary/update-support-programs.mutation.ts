import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateSupportProgramsInput } from '~/server/schema'
import { updateSupportProgramsSchema } from '~/server/schema'
import { BeneficiaryService } from '~/server/services'
import { prismaClient } from '~/server/prisma'
import { connect } from '~/utils/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateSupportProgramsInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.externalOrganisations
}

const handler = async ({
  ctx,
  input
}: {
  input: UpdateSupportProgramsInput
  ctx: ProtectedAppContext
}) => {
  const { id: beneficiaryId, supportPrograms } = input
  const structureId = ctx.structure.id

  await prismaClient.$transaction([
    prismaClient.supportProgram.deleteMany({
      where: { beneficiaryId }
    }),
    ...supportPrograms.map(supportProgram =>
      prismaClient.supportProgram.create({
        data: {
          id: supportProgram.id,
          beneficiary: { connect: { id: beneficiaryId } },
          startDate: supportProgram.startDate ?? null,
          endDate: supportProgram.endDate ?? null,
          partnerOrganisation: supportProgram.partnerOrganisationId
            ? connect(supportProgram.partnerOrganisationId)
            : undefined,
          precisions: supportProgram.precisions ?? null,
          exitReason: supportProgram.exitReason ?? null,
          supportProgramName: {
            connectOrCreate: {
              where: {
                structureId_name: { structureId, name: supportProgram.name }
              },
              create: {
                name: supportProgram.name,
                structureId,
                createdById: ctx.user.id
              }
            }
          }
        }
      })
    )
  ])

  return { id: beneficiaryId }
}

export const updateSupportProgramsMutation = createMutation({
  inputValidation: updateSupportProgramsSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateSupportPrograms',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
