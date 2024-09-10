import { Prisma } from '@prisma/client'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryRepo, FamilyFileRepo } from '~/server/database'
import { IdInput } from '~/server/schema'

async function getBeneficiary(ctx: SecurityRuleContext, beneficiaryId: string) {
  return await BeneficiaryRepo.findWithNoDraftCondition(ctx.user, {
    where: { id: beneficiaryId },
    select: {
      id: true,
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
        },
        include: {
          budget: {
            include: {
              expenses: {
                include: {
                  loans: true,
                  debts: true
                }
              }
            }
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
        incomes: {
          connect: { id: beneficiary.income?.id }
        }
      }
    }
  }

  const migrateBeneficiaryToNewFamilyFile = FamilyFileRepo.prisma.create({
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

  const logBeneficiaryMigration = BeneficiaryRepo.prisma.update({
    where: { id },
    data: {
      previousFamilyFile: {
        connect: { id: beneficiary.familyFile.id }
      },
      splitFromFileBy: {
        connect: { id: ctx.user.id }
      }
    }
  })

  const [res, _] = await Promise.all([
    migrateBeneficiaryToNewFamilyFile,
    logBeneficiaryMigration
  ])

  return res
}
