import type { Prisma } from '@prisma/client'
import type { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import type { IdInput } from '~/server/schema'
import { forbiddenError } from '~/server/trpc'

async function getBeneficiary(ctx: SecurityRuleContext, beneficiaryId: string) {
  return await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: beneficiaryId },
    select: {
      id: true,
      relationship: true,
      documents: {
        select: { key: true }
      },
      socialSupports: {
        select: { id: true }
      },
      income: {
        select: { id: true }
      },
      familyFile: {
        select: {
          id: true,
          referents: {
            select: { id: true }
          }
        }
      }
    }
  })
}

/** Creates a new family file and migrate beneficiary data to it
 * id: id of the beneficiary to split
 */
export async function split({
  ctx,
  input: { id }
}: {
  ctx: SecurityRuleContext
  input: IdInput
}) {
  const beneficiary = await getBeneficiary(ctx, id)

  if (beneficiary.relationship == null) {
    throw forbiddenError('Cannont split the main beneficiary from family file')
  }

  const data: Prisma.FamilyFileCreateInput = {
    structure: {
      connect: { id: ctx.structure.id }
    },
    referents: {
      connect: beneficiary.familyFile.referents.map(referent => ({
        id: referent.id
      }))
    },
    beneficiaries: {
      connect: { id }
    },
    documents: {
      connect: beneficiary.documents.map(doc => ({ key: doc.key }))
    },
    socialSupports: {
      connect: beneficiary.socialSupports.map(ss => ({ id: ss.id }))
    },
    budget: {
      create: {
        expenses: {
          create: {}
        },
        ...(beneficiary.income && {
          incomes: {
            connect: [{ id: beneficiary.income.id }]
          }
        })
      }
    }
  }

  const migrateBeneficiaryToNewFamilyFile = () =>
    FamilyFileRepo.prisma.create({
      data,
      select: {
        id: true,
        budget: {
          select: {
            id: true,
            expenses: {
              select: { id: true }
            }
          }
        }
      }
    })

  const logBeneficiaryMigration = () =>
    BeneficiaryRepo.prisma.update({
      where: { id },
      data: {
        relationship: null,
        previousFamilyFile: {
          connect: { id: beneficiary.familyFile.id }
        },
        splitFromFileBy: {
          connect: { id: ctx.user.id }
        }
      }
    })

  const [res, _] = await Promise.all([
    migrateBeneficiaryToNewFamilyFile(),
    logBeneficiaryMigration()
  ])

  return res
}
