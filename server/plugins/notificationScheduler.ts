import { NotificationType, SocialSupport, UserRole } from '@prisma/client'
import dayjs from 'dayjs'
import {
  BeneficiaryRepo,
  HelpRequestRepo,
  NotificationRepo,
  SocialSupportRepo
} from '~/server/database'
import { useScheduler } from '#scheduler'
import {
  getArchiveDate,
  getBeneficiaryLastActivity
} from '../services/beneficiary/get-last-activity.service'

export default defineNitroPlugin(() => {
  startScheduler()
})

function socialSupportHasDefinedCreatedBy<
  T extends { createdById: string | null }
>(item: T): item is T & { createdById: string } {
  return item.createdById !== null
}

function hasDefinedCreatedBy<
  T extends { socialSupport: { createdById: string | null } }
>(item: T): item is T & { createdById: string } {
  return item.socialSupport.createdById !== null
}

async function createDueSocialSupportNotifications(
  dueSocialSupports: SocialSupport[],
  type: 'DueDateToday' | 'DueDateOneMonth'
) {
  const dueFollowupNotifications = dueSocialSupports
    .filter(socialSupportHasDefinedCreatedBy)
    .map(socialSupport => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type
    }))

  await NotificationRepo.prisma.createMany({
    data: dueFollowupNotifications
  })
}

async function createDueInAMonthSocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: dayjs().add(1, 'month').toDate()
    }
  })

  await createDueSocialSupportNotifications(
    dueSocialSupports,
    NotificationType.DueDateOneMonth
  )
}

async function createDueTodaySocialSupportNotifications() {
  const dueSocialSupports = await SocialSupportRepo.prisma.findMany({
    where: {
      dueDate: new Date()
    }
  })

  await createDueSocialSupportNotifications(
    dueSocialSupports,
    NotificationType.DueDateToday
  )
}

async function createEndOfSupportHelpRequestNotifications() {
  const endOfSupportHelpRequests = await HelpRequestRepo.prisma.findMany({
    include: {
      fileInstruction: {
        include: {
          socialSupport: true
        }
      }
    },
    where: {
      handlingDate: new Date()
    }
  })

  const endOfSupportHelpRequestNotifications = endOfSupportHelpRequests
    .filter(hr => hasDefinedCreatedBy(hr.fileInstruction))
    .map(({ fileInstruction: { socialSupport } }) => ({
      recipientId: socialSupport.createdById,
      beneficiaryId: socialSupport.beneficiaryId,
      socialSupportId: socialSupport.id,
      type: NotificationType.EndOfSupport
    }))

  await NotificationRepo.prisma.createMany({
    data: endOfSupportHelpRequestNotifications
  })
}

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

const filteredArchiveNotifications = async (
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

function startScheduler() {
  const scheduler = useScheduler()

  scheduler
    .run(async () => {
      await createDueInAMonthSocialSupportNotifications()
      await createDueTodaySocialSupportNotifications()
      await createEndOfSupportHelpRequestNotifications()
    })
    .dailyAt(1, 0)

  scheduler
    .run(async () => {
      await createArchiveDueNotifications()
    })
    .cron('0 2 1 * *')
}
