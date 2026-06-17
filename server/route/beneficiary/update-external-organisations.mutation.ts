import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import type { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'
import { updateBeneficiaryExternalOrganisationsSchema } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { connect } from '~/utils/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiaryExternalOrganisationsInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.edit.externalOrganisations
}

/** Diffs incoming support programs against existing ones to produce Prisma nested create/delete/update operations. */
async function prepareSupportProgramUpdates(
  user: ProtectedAppContext['user'],
  beneficiaryId: string,
  supportPrograms: UpdateBeneficiaryExternalOrganisationsInput['supportPrograms'],
  structureId: string
) {
  const previousSupportPrograms = await BeneficiaryRepo.findUniqueOrThrow(
    user,
    {
      where: { id: beneficiaryId },
      select: {
        supportPrograms: { select: { id: true } }
      }
    }
  ).then(b => b.supportPrograms)

  const previousIds = previousSupportPrograms.map(sp => sp.id)
  const incomingIds = supportPrograms.map(sp => sp.id)

  const toCreate = supportPrograms
    .filter(sp => !previousIds.includes(sp.id))
    .map(sp => ({
      id: sp.id,
      startDate: sp.startDate ?? null,
      endDate: sp.endDate ?? null,
      precisions: sp.precisions ?? null,
      exitReason: sp.exitReason ?? null,
      partnerOrganisation: sp.partnerOrganisationId
        ? connect(sp.partnerOrganisationId)
        : undefined,
      supportProgramName: {
        connect: { structureId_name: { structureId, name: sp.name } }
      }
    }))

  const toDelete = previousSupportPrograms
    .filter(sp => !incomingIds.includes(sp.id))
    .map(sp => ({ id: sp.id }))

  const toUpdate = supportPrograms
    .filter(sp => previousIds.includes(sp.id))
    .map(sp => ({
      where: { id: sp.id },
      data: {
        startDate: sp.startDate ?? null,
        endDate: sp.endDate ?? null,
        precisions: sp.precisions ?? null,
        exitReason: sp.exitReason ?? null,
        partnerOrganisation: sp.partnerOrganisationId
          ? connect(sp.partnerOrganisationId)
          : { disconnect: true },
        supportProgramName: {
          connect: { structureId_name: { structureId, name: sp.name } }
        }
      }
    }))

  return { create: toCreate, delete: toDelete, update: toUpdate }
}

const handler = async ({
  ctx,
  input
}: {
  input: UpdateBeneficiaryExternalOrganisationsInput
  ctx: ProtectedAppContext
}) => {
  const { id, supportPrograms, ...externalOrganisations } = input

  const supportProgramUpdates = await prepareSupportProgramUpdates(
    ctx.user,
    id,
    supportPrograms,
    ctx.structure.id
  )

  const updatedBeneficiary = await BeneficiaryRepo.prisma.update({
    select: { id: true },
    where: { id },
    data: {
      ...externalOrganisations,
      supportPrograms: supportProgramUpdates
    }
  })

  return updatedBeneficiary
}

export const updateExternalOrganisationsMutation = createMutation({
  inputValidation: updateBeneficiaryExternalOrganisationsSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.updateExternalOrganisations',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
