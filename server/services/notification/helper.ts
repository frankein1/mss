import { NotificationType, Prisma, UserRole, UserStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { BeneficiaryRepo, NotificationRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'
import { performance } from 'node:perf_hooks'

type InactiveBeneficiary = Awaited<ReturnType<typeof inactiveQuery>>[0]

/** Get Beneficiaries that have been inactive for more than 23 months
 * and that have not been set an archive due date manually
 *
 * This query will be used to determine the beneficiaries that will be sent
 * a due in 1 month notification */
export const getInactiveBeneficiaries = async (withStructure = false) => {
  const beneficiaries = await inactiveQuery()
  return beneficiaries.map(b => format(b, withStructure))
}

/** Get Beneficiaries that have been inactive for more than 23 months,
 * and have received an archive due on one month notification already
 * /!\ Only distinct entries for beneficiaries are selected since notifications
 * for a beneficiary are sent to all referents
 *
 * This function allows to retrieve the beneficiaries that can receive a due in 7 days
 * or a due today notification without parsing the whole beneficiary database again */
export async function getInactiveBeneficiariesWithOneMonthNotification(
  withStructure = false
) {
  const notifications = await inactiveQueryFromNotification()
  return notifications
    .map(n => (n.beneficiary ? format(n.beneficiary, withStructure) : null))
    .filter(b => !!b)
}

async function inactiveQuery() {
  const start = performance.now()
  const res = await BeneficiaryRepo.prisma.findMany({
    where: where(),
    select: select()
  })
  const end = performance.now()
  const duration = (end - start) / 1000
  console.log(
    `    inactive query [${new Date()}]: time: ${duration}s - nb : ${res.length}`
  )
  return res
}

async function inactiveQueryFromNotification() {
  return await NotificationRepo.prisma.findMany({
    distinct: ['beneficiaryId'],
    where: {
      type: NotificationType.ArchiveDueOneMonth,
      // TODO filter manual archiveDuedate is today in query cf. issue #755
      beneficiary: where()
    },
    select: {
      beneficiary: {
        select: select()
      }
    }
  })
}

// Date migration Budget 2024-06-03T23:06:59.476Z
// On récupère également les beneficiaire qui on une date de budget égale au 03/06/2024 car c'est une date de migration
// TODO [2026-06-04]: après le 3 juin 2026, on peut supprimer cette condition
const budgetMigrationDateRange = {
  lt: new Date('2024-06-04'),
  gte: new Date('2024-06-03')
}

/** Prisma filter to select beneficiaries that have been inactive for more than 23 months
 * and have not been set an archive due date manually */
function where(): Prisma.BeneficiaryWhereInput {
  const twentyThreeMonthsBefore = dayjs().subtract(23, 'month').toDate()

  // The updated and created fields are optional so elements without this information are included
  const nullOrUpdatedMoreThen23MonthsAgo = [
    { updated: { lte: twentyThreeMonthsBefore } },
    { updated: null }
  ]

  /** The followings are constraints to query beneficiaries with no activity in beneficiary profile, social supports, documents and budget.
   * When adding new features to the beneficiary, this query should be updated */

  const beneficiaryCreatedMoreThan23MonthsAgo: Prisma.BeneficiaryWhereInput = {
    OR: [{ created: { lte: twentyThreeMonthsBefore } }, { created: null }]
  }

  const beneficiaryUpdatedMoreThan23MonthsAgo: Prisma.BeneficiaryWhereInput = {
    OR: nullOrUpdatedMoreThen23MonthsAgo
  }

  // filter beneficiaries with no social supports OR social supports updated more than 23 months ago
  // const allSocialSupportsUpdatedMoreThan23MonthsAgo: Prisma.BeneficiaryWhereInput =
  //   {
  //     OR: [
  //       { socialSupports: { none: {} } },
  //       { socialSupports: { every: { OR: nullOrUpdatedMoreThen23MonthsAgo } } }
  //     ]
  //   }

  const budgetUpdatedMoreThan23MonthsAgo: Prisma.BudgetWhereInput = {
    OR: [
      ...nullOrUpdatedMoreThen23MonthsAgo,
      { updated: budgetMigrationDateRange }
    ]
  }

  // filter beneficiaries with no incomes OR incomes updated more than 23 months ago
  // custom incomes are updated at the same time as incomes so filtering on them is not necessary
  // const allIncomesUpdatedMoreThan23MonthsAgo: Prisma.BudgetWhereInput = {
  //   OR: [
  //     { incomes: { none: {} } },
  //     {
  //       incomes: {
  //         every: {
  //           OR: [
  //             ...nullOrUpdatedMoreThen23MonthsAgo,
  //             { updated: budgetMigrationDateRange }
  //           ]
  //         }
  //       }
  //     }
  //   ]
  // }

  // filter beneficiaries with no expenses OR expenses updated more than 23 months ago
  // loans, debts and custom expenses are updated at the same time as expenses so filtering on them is not necessary
  const expensesUpdatedMoreThan23MonthsAgo: Prisma.BudgetWhereInput = {
    OR: [
      { expenses: null },
      {
        expenses: {
          OR: [
            ...nullOrUpdatedMoreThen23MonthsAgo,
            { updated: budgetMigrationDateRange }
          ]
        }
      }
    ]
  }

  // filter beneficiaries with no documents OR documents created more than 23 months ago
  // (there is no updated field on document)
  // const allDocumentsCreatedMoreThan23MonthsAgo: Prisma.BeneficiaryWhereInput = {
  //   OR: [
  //     { documents: { none: {} } },
  //     {
  //       documents: {
  //         every: {
  //           OR: [
  //             { created: { lte: twentyThreeMonthsBefore } },
  //             { created: null }
  //           ]
  //         }
  //       }
  //     }
  //   ]
  // }

  // The query is simplified because it took too much time
  // The filter on activity for supports and document is performed during
  // the filter on archive date in the software and not in the DB anymore
  // This should soon be migrated to a persisted beneficiary last activity date
  // because it won't work when there are too many beneficiaries inactive
  // See https://github.com/prisma/prisma/issues/21648
  const where: Prisma.BeneficiaryWhereInput = {
    AND: [
      { archiveDueDate: null },
      { structure: { disabled: false } },
      beneficiaryCreatedMoreThan23MonthsAgo,
      beneficiaryUpdatedMoreThan23MonthsAgo,
      // allSocialSupportsUpdatedMoreThan23MonthsAgo,
      // allDocumentsCreatedMoreThan23MonthsAgo,
      { familyFile: { budget: budgetUpdatedMoreThan23MonthsAgo } },
      { familyFile: { budget: expensesUpdatedMoreThan23MonthsAgo } }
      // { familyFile: { budget: allIncomesUpdatedMoreThan23MonthsAgo } }
    ]
  }

  return where
}

/** Prisma select to include all fields allowing to compute the last activity date for a beneficiary */
function select() {
  return {
    id: true,
    usualName: true,
    updated: true,
    created: true,
    archiveDueDate: true,
    documents: {
      select: {
        created: true
      }
    },
    socialSupports: {
      select: {
        updated: true
      }
    },
    familyFile: {
      select: {
        referents: {
          where: { status: UserStatus.Active },
          select: { id: true, role: true }
        },
        budget: {
          select: {
            updated: true,
            expenses: {
              select: {
                updated: true,
                loans: {
                  select: {
                    updated: true
                  }
                },
                debts: {
                  select: {
                    updated: true
                  }
                },
                customs: {
                  select: {
                    updated: true
                  }
                }
              }
            },
            incomes: {
              select: {
                updated: true,
                customs: {
                  select: {
                    updated: true
                  }
                }
              }
            }
          }
        }
      }
    },
    structure: {
      select: {
        name: true, // pour tests
        users: {
          where: {
            role: UserRole.StructureManager
          },
          select: {
            id: true
          }
        }
      }
    }
  }
}

/** Format inactive query result to add referents, lastActivity and archiveDate */
function format(b: InactiveBeneficiary, withStructure: boolean) {
  const lastActivity = BeneficiaryService.getBeneficiaryLastActivity(b)
  const archiveDate = BeneficiaryService.getArchiveDate(
    lastActivity,
    b.archiveDueDate
  )

  return {
    id: b.id,
    lastActivity,
    archiveDueDate: b.archiveDueDate,
    archiveDate,
    referentIds: [
      ...new Set([
        // family file referents except reception agents
        ...b.familyFile.referents
          .filter(referent => referent.role !== UserRole.ReceptionAgent)
          .map(r => r.id),
        // structure managers
        ...b.structure.users.map(u => u.id)
      ])
    ],
    ...(withStructure && { structure: { name: b.structure.name } })
  }
}
