import { UserStatus, type Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { prismaClient } from '~~/server/prisma'
import { withErrorCapture } from '../utils'
import { getSupportProgramNotificationRecipientIds } from './getNotificationRecipientIds'

// Recipients for support program end notifications:
// - The creators of the social supports attached to the program, regardless of their role
// - Active family file referents with an allowed role:
//   StructureManager, SocialWorker, Referent
// - Excluded: ReceptionAgent, Instructor, disabled users
const supportProgramSelect = {
  id: true,
  beneficiaryId: true,
  supportProgramName: { select: { name: true } },
  socialSupports: { select: { createdById: true } },
  beneficiary: {
    select: {
      familyFile: {
        select: {
          referents: {
            where: { status: UserStatus.Active },
            select: {
              id: true,
              role: true
            }
          }
        }
      }
    }
  }
} satisfies Prisma.SupportProgramSelect

type SupportProgramForNotification = Prisma.SupportProgramGetPayload<{
  select: typeof supportProgramSelect
}>

const getRecipientIds = (
  supportProgram: SupportProgramForNotification
): Set<string> =>
  getSupportProgramNotificationRecipientIds({
    createdByIds: supportProgram.socialSupports.map(
      socialSupport => socialSupport.createdById
    ),
    referents: supportProgram.beneficiary.familyFile.referents
  })

async function createNotifications(
  type: 'SupportProgramEndToday' | 'SupportProgramEndOneMonth'
) {
  const endDate =
    type === 'SupportProgramEndToday'
      ? new Date()
      : dayjs().add(1, 'month').toDate()

  // endDate is nullable: the equality filter already excludes programs without an end date
  const supportPrograms = await prismaClient.supportProgram.findMany({
    select: supportProgramSelect,
    where: { endDate }
  })

  const data = supportPrograms.flatMap(supportProgram =>
    Array.from(getRecipientIds(supportProgram)).map(recipientId => ({
      recipientId,
      beneficiaryId: supportProgram.beneficiaryId,
      supportProgramId: supportProgram.id,
      detail: supportProgram.supportProgramName.name,
      type
    }))
  ) satisfies Prisma.NotificationCreateManyInput[]

  const res = await prismaClient.notification.createMany({ data })

  console.log(
    `create-support-program-notifications [${new Date().toISOString()}]: ` +
      `${res.count} notifications created for support programs ending ` +
      `${type === 'SupportProgramEndToday' ? 'today' : 'in a month'}`
  )
}

export default {
  createEndInAMonthSupportProgramNotifications: async () =>
    await withErrorCapture(() =>
      createNotifications('SupportProgramEndOneMonth')
    ),
  createEndTodaySupportProgramNotifications: async () =>
    await withErrorCapture(() => createNotifications('SupportProgramEndToday'))
}
