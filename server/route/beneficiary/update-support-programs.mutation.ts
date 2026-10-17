import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { SecurityRuleContext } from '~~/server/security'
import {
  validateManyBelongToStructure,
  validatePartnerOrganizationIds
} from '~~/server/security'
import { invalidError, type ProtectedAppContext } from '~~/server/trpc'
import type { UpdateBeneficiarySupportProgramsServerInput } from '~~/server/schema'
import { updateBeneficiarySupportProgramsSchema } from '~~/server/schema'
import { BeneficiaryRepo, SupportProgramNameRepo } from '~~/server/database'
import { BeneficiaryService, SupportProgramService } from '~~/server/services'
import { prepareRelationUpdates } from '~/utils/prisma'
import { prismaClient } from '~~/server/prisma'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: UpdateBeneficiarySupportProgramsServerInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  if (!permissions.edit.supportPrograms) {
    return false
  }

  const partnerOrgIds = input.supportPrograms.flatMap(
    sp => sp.partnerOrganisationIds
  )
  const supportProgramNameIds = input.supportPrograms.map(
    sp => sp.supportProgramNameId
  )

  const [partnerOrgValid, supportProgramNameValid] = await Promise.all([
    validatePartnerOrganizationIds(ctx.user, partnerOrgIds, []),
    validateManyBelongToStructure(
      ctx.user,
      supportProgramNameIds,
      SupportProgramNameRepo.count
    )
  ])

  return partnerOrgValid && supportProgramNameValid
}

function toSupportProgramData(
  sp: UpdateBeneficiarySupportProgramsServerInput['supportPrograms'][number],
  exitReasonIds: Map<string, string>
) {
  return {
    id: sp.id,
    startDate: sp.startDate ?? null,
    endDate: sp.endDate ?? null,
    outcome: sp.outcome ?? null,
    exitReasonId: sp.exitReason
      ? (exitReasonIds.get(sp.exitReason) ?? null)
      : null,
    supportProgramNameId: sp.supportProgramNameId
  }
}

async function throwBadRequestIfInvalidLifecycleData(
  ctx: ProtectedAppContext,
  supportPrograms: UpdateBeneficiarySupportProgramsServerInput['supportPrograms']
) {
  const hasLifecycleData = (
    sp: UpdateBeneficiarySupportProgramsServerInput['supportPrograms'][number]
  ) => !!(sp.startDate || sp.endDate || sp.exitReason)

  const nameIds = [
    ...new Set(supportPrograms.map(sp => sp.supportProgramNameId))
  ]
  const names = await SupportProgramNameRepo.findMany(ctx.user, {
    where: { id: { in: nameIds } },
    select: { id: true, hasLifecycle: true }
  })
  const lifecycleByNameId = new Map(names.map(n => [n.id, n.hasLifecycle]))

  for (const sp of supportPrograms) {
    if (
      !lifecycleByNameId.get(sp.supportProgramNameId) &&
      hasLifecycleData(sp)
    ) {
      throw invalidError(
        'Lifecycle data is not allowed for non-lifecycle support program names'
      )
    }
  }
}

const handler = async ({
  ctx,
  input
}: {
  input: UpdateBeneficiarySupportProgramsServerInput
  ctx: ProtectedAppContext
}) => {
  const { id, supportPrograms } = input

  await throwBadRequestIfInvalidLifecycleData(ctx, supportPrograms)

  const previousSupportPrograms = await BeneficiaryRepo.findUniqueOrThrow(
    ctx.user,
    {
      where: { id },
      select: { supportPrograms: { select: { id: true, exitReasonId: true } } }
    }
  ).then(b => b.supportPrograms)

  // Exit reasons this save could leave orphaned: the previous reason of every
  // program already attached to the beneficiary. Reasons still linked after the
  // write are kept by the `none: {}` guard in pruneOrphanedExitReasons.
  const candidateExitReasonIds = previousSupportPrograms
    .map(sp => sp.exitReasonId)
    .filter((reasonId): reasonId is string => reasonId !== null)

  const partnerOrgsByProgramId = new Map(
    supportPrograms.map(sp => [
      sp.id,
      sp.partnerOrganisationIds.map(orgId => ({ id: orgId }))
    ])
  )

  // Resolve the exit-reason catalog, write the programs and prune orphaned
  // reasons in a single transaction. Resolution is folded in so a new reason is
  // never committed before it is linked; the prune is targeted so it cannot
  // race another request's reasons. Raw tx client: the constraint layer cannot
  // run inside an interactive transaction (structure scoping comes from ctx).
  // See docs/review-1198-dispositifs-motifs-de-sortie.md (Addendum 2).
  return prismaClient.$transaction(async tx => {
    const exitReasonIds = await SupportProgramService.resolveExitReasonIds(
      tx,
      ctx,
      supportPrograms.map(sp => sp.exitReason)
    )

    // Relation updates must manage many-to-many relation for partner organization
    const relationUpdates = prepareRelationUpdates(
      supportPrograms.map(sp => toSupportProgramData(sp, exitReasonIds)),
      previousSupportPrograms
    )

    const updatedBeneficiary = await tx.beneficiary.update({
      select: { id: true },
      where: { id },
      data: {
        supportPrograms: {
          create: relationUpdates.create.map(({ id: spId, ...data }) => ({
            id: spId,
            ...data,
            partnerOrganisations: {
              connect: partnerOrgsByProgramId.get(spId) ?? []
            }
          })),
          delete: relationUpdates.delete,
          update: relationUpdates.update.map(u => ({
            where: u.where,
            data: {
              ...u.data,
              partnerOrganisations: {
                set: partnerOrgsByProgramId.get(u.where.id) ?? []
              }
            }
          }))
        }
      }
    })

    await SupportProgramService.pruneOrphanedExitReasons(
      tx,
      ctx,
      candidateExitReasonIds
    )

    return updatedBeneficiary
  })
}

export const updateSupportProgramsMutation = createMutation({
  inputValidation: updateBeneficiarySupportProgramsSchema,
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
