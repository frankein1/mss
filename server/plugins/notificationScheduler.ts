import { NotificationType, SocialSupport } from '@prisma/client'
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
      referentIds: beneficiary.familyFile.referents.map(r => r.id)
    }))

  const flatenBeneficiaries = mustBeArchivedBeneficiaries
    .map(beneficiary =>
      beneficiary.referentIds.flatMap(referentId => ({
        detail: getArchiveDate(
          beneficiary.lastActivity,
          beneficiary.archiveDueDate
        ).toLocaleDateString(),
        beneficiaryId: beneficiary.id,
        recipientId: referentId,
        type: NotificationType.ArchiveDue
      }))
    )
    .flat()

  await NotificationRepo.prisma.createMany({
    data: flatenBeneficiaries
  })
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
