import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import { RelativeRelationship } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { prismaClient } from '~/server/prisma/prismaClient'
import { MSS_ERROR_CODES } from '~/utils/error'

export async function linkToFamilyFile({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: {
    beneficiaryId: string
    familyFileId: string
    relationship: RelativeRelationship
  }
}) {
  const beneficiary = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    select: {
      id: true,
      income: { select: { id: true, budget: { select: { id: true } } } },
      documents: { select: { key: true } },
      socialSupports: { select: { id: true } },
      familyFile: {
        select: {
          id: true,
          structureId: true,
          referents: { select: { id: true } },
          _count: { select: { beneficiaries: true } }
        }
      }
    },
    where: { id: input.beneficiaryId }
  })

  if (beneficiary.familyFile.id === input.familyFileId) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: `Beneficiary ${input.beneficiaryId} is already linked to FamilyFile ${input.familyFileId}`,
      cause: {
        MSS_CODE: MSS_ERROR_CODES.BENEFICIARY_ALREADY_LINKED_TO_FAMILY_FILE
      }
    })
  }

  if (beneficiary.familyFile._count.beneficiaries > 1) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Beneficiary ${beneficiary.id} is linked to a FamilyFile with more than one beneficiary: ${beneficiary.familyFile.id}`,
      cause: {
        MSS_CODE: MSS_ERROR_CODES.FAMILIY_FILE_HAS_MULTIPLE_BENEFICIARIES
      }
    })
  }

  // Both mutations should succeed or fail together, and be rolled back if necessary,
  // so we run them in a transaction
  await prismaClient.$transaction([
    BeneficiaryRepo.update(ctx.user, {
      data: {
        familyFileId: input.familyFileId,
        relationship: input.relationship,
        // Prevent operation failure if no income exists
        income:
          beneficiary.income !== null
            ? {
                update: {
                  data: {
                    budget: { connect: { familyFileId: input.familyFileId } }
                  }
                }
              }
            : undefined,
        documents: {
          updateMany: {
            data: { familyFileId: input.familyFileId },
            where: {}
          }
        },
        socialSupports: {
          updateMany: {
            data: { familyFileId: input.familyFileId },
            where: {}
          }
        }
      },
      where: { id: input.beneficiaryId }
    }),
    FamilyFileRepo.update(ctx.user, {
      data: {
        referents: { connect: beneficiary.familyFile.referents }
      },
      where: { id: input.familyFileId }
    })
  ])

  // This can't be run inside the transaction, because the operation could
  // trigger a cascade delete on related entities (eg. documents, budget, socialsupports)
  // that we want to migrate first to the new family file, so we only perform
  // the delete operation after the transaction has successfully run.
  await FamilyFileRepo.delete(ctx.user, {
    where: { id: beneficiary.familyFile.id }
  })

  return
}
