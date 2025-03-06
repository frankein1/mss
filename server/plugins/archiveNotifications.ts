import { NotificationType, UserRole, UserStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { BeneficiaryRepo, NotificationRepo } from '~/server/database'
import {
  getArchiveDate,
  getBeneficiaryLastActivity
} from '../services/beneficiary/get-last-activity.service'
import { prismaClient } from '~/server/prisma'

const createArchiveDueNotifications = async () => {
  const inactiveBeneficiaries = await getInactiveBeneficiaries()
  const mustBeArchivedBeneficiaries = inactiveBeneficiaries
    .filter(beneficiary => {
      const lastActivity = getBeneficiaryLastActivity(beneficiary)
      const archiveDate = getArchiveDate(
        lastActivity,
        beneficiary.archiveDueDate
      )
      return dayjs(archiveDate).subtract(1, 'month').isBefore(dayjs())
    })
    .map(beneficiary => ({
      id: beneficiary.id,
      lastActivity: getBeneficiaryLastActivity(beneficiary),
      archiveDueDate: beneficiary.archiveDueDate,
      referentIds: [
        ...new Set([
          ...beneficiary.familyFile.referents
            .filter(referent => referent.role !== UserRole.ReceptionAgent)
            .map(r => r.id),
          ...beneficiary.structure.users.map(u => u.id)
        ])
      ]
    }))

  const archiveNotifications = mustBeArchivedBeneficiaries
    .map(beneficiary =>
      beneficiary.referentIds.flatMap(referentId => ({
        archiveDate: getArchiveDate(
          beneficiary.lastActivity,
          beneficiary.archiveDueDate
        ),
        beneficiaryId: beneficiary.id,
        recipientId: referentId,
        type: NotificationType.ArchiveDue
      }))
    )
    .flat()

  const filteredNotifications =
    await compareAndFilterNotifications(archiveNotifications)

  await NotificationRepo.prisma.createMany({
    data: filteredNotifications
  })
}

export const getInactiveBeneficiaries = async () => {
  const twentyThreeMonthsBefore = dayjs().subtract(23, 'month').toDate()
  const oneMonthBefore = dayjs().subtract(1, 'month').toDate()
  // Date migration Budget 2024-06-03T23:06:59.476Z
  // On récupère également les beneficiaire qui on une date de budget égale au 03/06/2024
  // car c'est une date de migration
  // TODO [2026-06-04]: après le 3 juin 2026, on peut supprimer cette condition
  const budgetMigrationDateRange = {
    lt: new Date('2024-06-04'),
    gte: new Date('2024-06-03')
  }
  return await BeneficiaryRepo.prisma.findMany({
    where: {
      AND: [
        {
          OR: [
            { archiveDueDate: { gte: oneMonthBefore } },
            { archiveDueDate: null }
          ]
        },
        {
          OR: [{ created: { lte: twentyThreeMonthsBefore } }, { created: null }]
        },
        {
          OR: [{ updated: { lte: twentyThreeMonthsBefore } }, { updated: null }]
        },
        {
          familyFile: {
            budget: {
              OR: [
                { updated: { lte: twentyThreeMonthsBefore } },
                {
                  updated: budgetMigrationDateRange
                },
                { updated: null }
              ]
            }
          }
        },
        {
          familyFile: {
            budget: {
              expenses: {
                OR: [
                  { updated: { lte: twentyThreeMonthsBefore } },
                  {
                    updated: budgetMigrationDateRange
                  },
                  { updated: null }
                ]
              }
            }
          }
        },
        {
          familyFile: {
            budget: {
              OR: [
                {
                  incomes: {
                    some: { updated: { lte: twentyThreeMonthsBefore } }
                  }
                },
                {
                  incomes: {
                    some: {
                      updated: budgetMigrationDateRange
                    }
                  }
                },
                { incomes: { none: {} } }
              ]
            }
          }
        },
        {
          familyFile: {
            budget: {
              OR: [
                {
                  incomes: {
                    some: {
                      customs: {
                        some: { updated: { lte: twentyThreeMonthsBefore } }
                      }
                    }
                  }
                },
                {
                  incomes: {
                    some: {
                      customs: { none: {} }
                    }
                  }
                }
              ]
            }
          }
        },
        {
          familyFile: {
            budget: {
              expenses: {
                OR: [
                  {
                    loans: {
                      some: { updated: { lte: twentyThreeMonthsBefore } }
                    }
                  },
                  {
                    loans: {
                      some: { updated: budgetMigrationDateRange }
                    }
                  },
                  {
                    loans: {
                      none: {}
                    }
                  }
                ]
              }
            }
          }
        },
        {
          familyFile: {
            budget: {
              expenses: {
                OR: [
                  {
                    debts: {
                      some: { updated: { lte: twentyThreeMonthsBefore } }
                    }
                  },
                  {
                    debts: {
                      some: { updated: budgetMigrationDateRange }
                    }
                  },
                  {
                    debts: {
                      none: {}
                    }
                  }
                ]
              }
            }
          }
        },
        {
          familyFile: {
            budget: {
              expenses: {
                OR: [
                  {
                    customs: {
                      some: { updated: { lte: twentyThreeMonthsBefore } }
                    }
                  },
                  {
                    customs: {
                      none: {}
                    }
                  }
                ]
              }
            }
          }
        },
        {
          OR: [
            {
              documents: { some: { created: { lte: twentyThreeMonthsBefore } } }
            },
            { documents: { none: {} } }
          ]
        },
        {
          structure: {
            disabled: false
          }
        }
      ]
    },
    select: {
      id: true,
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
                  updated: true
                }
              },
              incomes: {
                select: {
                  updated: true
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
  })
}

type ArchiveNotification = {
  archiveDate: Date
  beneficiaryId: string
  recipientId: string
  type: NotificationType
}
export const compareAndFilterNotifications = async (
  notifications: ArchiveNotification[]
) => {
  const res = await prismaClient.notification.findMany({
    where: {
      type: NotificationType.ArchiveDue
    }
  })
  const archiveNotificationsFromDb = res.map(notification => ({
    type: notification.type,
    beneficiaryId: notification.beneficiaryId,
    recipientId: notification.recipientId,
    archiveDate: notification.archiveDate
  })) as ArchiveNotification[]

  const filtered: ArchiveNotification[] = []

  notifications.forEach(notification => {
    const existing = archiveNotificationsFromDb.find(
      archiveNotification =>
        archiveNotification.beneficiaryId === notification.beneficiaryId &&
        archiveNotification.recipientId === notification.recipientId &&
        archiveNotification.archiveDate.getTime() ===
          notification.archiveDate.getTime()
    )
    if (!existing) {
      filtered.push(notification)
    }
  })
  return filtered
}

export default createArchiveDueNotifications
