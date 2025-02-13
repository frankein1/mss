import { NotificationType, UserRole } from '@prisma/client'
import dayjs from 'dayjs'
import { BeneficiaryRepo, NotificationRepo } from '~/server/database'
import {
  getArchiveDate,
  getBeneficiaryLastActivity
} from '../services/beneficiary/get-last-activity.service'

const createArchiveDueNotifications = async () => {
  const beneficiaries = await BeneficiaryRepo.prisma.findMany({
    where: {},
    select: {
      id: true,
      updated: true,
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
            select: { id: true }
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

  const mustBeArchivedBeneficiaries = beneficiaries
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
          ...beneficiary.familyFile.referents.map(r => r.id),
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

  const filtered = await filteredArchiveNotifications(archiveNotifications)

  await NotificationRepo.prisma.createMany({
    data: filtered
  })
}

export const filteredArchiveNotifications = async (
  notifications: {
    archiveDate: Date
    beneficiaryId: string
    recipientId: string
    type: NotificationType
  }[]
) => {
  const finalNotifications: {
    archiveDate: Date
    beneficiaryId: string
    recipientId: string
    type: NotificationType
  }[] = []

  const responses = await Promise.all(
    notifications.map(async notification => {
      return await NotificationRepo.prisma.count({
        where: {
          type: NotificationType.ArchiveDue,
          beneficiaryId: notification.beneficiaryId,
          recipientId: notification.recipientId,
          archiveDate: notification.archiveDate
        }
      })
    })
  )

  responses.forEach((response, index) => {
    if (response === 0) {
      finalNotifications.push(notifications[index])
    }
  })
  return finalNotifications
}

export default createArchiveDueNotifications
