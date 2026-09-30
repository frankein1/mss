import type { Prisma } from '@prisma/client'
import { NotificationType, SocialSupportType } from '@prisma/client'
import dayjs from 'dayjs'
import { fixtureStructures, FixtureStructure } from './fixtures'
import { prismaClient } from '~~/server/prisma'

const NOTIFICATIONS_PER_USER = 50
const STRUCTURE_ID = fixtureStructures[FixtureStructure.Test].id

// Obsolete type, migrated to SupportProgramEndTwoMonths
const NOTIFICATION_TYPES = Object.values(NotificationType).filter(
  type => type !== NotificationType.SupportProgramEndSixtyDays
)

const threeYearsAgo = dayjs().subtract(3, 'years')

function pick<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)]
}

function randomDateBetween(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  const startMs = start.valueOf()
  return new Date(startMs + Math.random() * (end.valueOf() - startMs))
}

async function loadStructureData(structureId: string) {
  const [users, beneficiaries, socialSupports, documents, comments, programs] =
    await Promise.all([
      prismaClient.user.findMany({
        where: { structureId },
        select: { id: true }
      }),
      prismaClient.beneficiary.findMany({
        where: { structureId },
        select: { id: true }
      }),
      prismaClient.socialSupport.findMany({
        where: { structureId },
        select: { id: true, beneficiaryId: true, socialSupportType: true }
      }),
      prismaClient.document.findMany({
        where: { beneficiary: { structureId } },
        select: { key: true, beneficiaryId: true }
      }),
      prismaClient.comment.findMany({
        where: { socialSupport: { structureId } },
        select: {
          id: true,
          socialSupportId: true,
          socialSupport: { select: { beneficiaryId: true } }
        }
      }),
      prismaClient.supportProgram.findMany({
        where: { beneficiary: { structureId } },
        select: { id: true, beneficiaryId: true }
      })
    ])

  return {
    users,
    beneficiaries,
    followups: socialSupports.filter(
      s => s.socialSupportType === SocialSupportType.Followup
    ),
    helpRequests: socialSupports.filter(
      s => s.socialSupportType !== SocialSupportType.Followup
    ),
    socialSupports,
    documents,
    comments,
    programs
  }
}

type StructureData = Awaited<ReturnType<typeof loadStructureData>>

// Links each notification type to the entities the UI expects
function getRelations(
  type: NotificationType,
  data: StructureData
): Partial<Prisma.NotificationUncheckedCreateInput> {
  const fromSocialSupport = (
    socialSupports: StructureData['socialSupports']
  ) => {
    const socialSupport = pick(socialSupports)
    return socialSupport
      ? {
          socialSupportId: socialSupport.id,
          beneficiaryId: socialSupport.beneficiaryId
        }
      : { beneficiaryId: pick(data.beneficiaries)?.id }
  }
  const fromDocument = () => {
    const document = pick(data.documents)
    return document
      ? { documentId: document.key, beneficiaryId: document.beneficiaryId }
      : { beneficiaryId: pick(data.beneficiaries)?.id }
  }
  const fromSupportProgram = () => {
    const program = pick(data.programs)
    return program
      ? { supportProgramId: program.id, beneficiaryId: program.beneficiaryId }
      : { beneficiaryId: pick(data.beneficiaries)?.id }
  }

  switch (type) {
    case NotificationType.NewDocument:
    case NotificationType.DocumentExpirationToday:
    case NotificationType.DocumentExpirationOneMonth:
      return fromDocument()
    case NotificationType.NewComment: {
      const comment = pick(data.comments)
      return comment
        ? {
            commentId: comment.id,
            socialSupportId: comment.socialSupportId,
            beneficiaryId: comment.socialSupport.beneficiaryId
          }
        : fromSocialSupport(data.socialSupports)
    }
    case NotificationType.NewFollowupElement:
    case NotificationType.UpdateFollowupElement:
      return fromSocialSupport(data.followups)
    case NotificationType.NewFileInstructionElement:
    case NotificationType.UpdateFileInstructionElement:
      return fromSocialSupport(data.helpRequests)
    case NotificationType.DueDateToday:
    case NotificationType.DueDateOneMonth:
    case NotificationType.EndOfSupport:
    case NotificationType.EndOfSupportOneMonth:
    case NotificationType.NewSocialSupportSubject:
      return fromSocialSupport(data.socialSupports)
    case NotificationType.SupportProgramEndToday:
    case NotificationType.SupportProgramEndSixtyDays:
    case NotificationType.SupportProgramEndTwoMonths:
      return fromSupportProgram()
    case NotificationType.ArchiveDueToday:
    case NotificationType.ArchiveDueSevenDays:
    case NotificationType.ArchiveDueOneMonth:
      return { beneficiaryId: pick(data.beneficiaries)?.id }
  }
}

function getArchiveDate(type: NotificationType, created: Date) {
  switch (type) {
    case NotificationType.ArchiveDueToday:
      return created
    case NotificationType.ArchiveDueSevenDays:
      return dayjs(created).add(7, 'days').toDate()
    case NotificationType.ArchiveDueOneMonth:
      return dayjs(created).add(1, 'month').toDate()
    default:
      return null
  }
}

function buildNotifications(
  structureId: string,
  recipientId: string,
  data: StructureData
): Prisma.NotificationCreateManyInput[] {
  const otherUsers = data.users.filter(u => u.id !== recipientId)

  return Array.from({ length: NOTIFICATIONS_PER_USER }, (_, index) => {
    // Cycle through the types so that every type is represented
    const type = NOTIFICATION_TYPES[index % NOTIFICATION_TYPES.length]!
    const created = randomDateBetween(threeYearsAgo, dayjs())
    const isRead = Math.random() < 0.5
    const readAt = isRead ? randomDateBetween(dayjs(created), dayjs()) : null

    return {
      type,
      recipientId,
      structureId,
      created,
      read: isRead,
      readAt,
      archiveDate: getArchiveDate(type, created),
      itemCreatedById: pick(otherUsers)?.id ?? recipientId,
      ...getRelations(type, data)
    }
  })
}

async function main() {
  const data = await loadStructureData(STRUCTURE_ID)
  const recipientIds = data.users.map(u => u.id)

  const notifications = recipientIds.flatMap(recipientId =>
    buildNotifications(STRUCTURE_ID, recipientId, data)
  )
  const { count } = await prismaClient.notification.createMany({
    data: notifications
  })

  console.log(`${count} notifications created for ${recipientIds.length} users`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prismaClient.$disconnect())
