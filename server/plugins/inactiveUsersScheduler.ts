import dayjs from 'dayjs'
import { UserRepo } from '~/server/database'
import { useScheduler } from '#scheduler'
import { createEmail } from '~/server/query'
import { getUserCreationEmailContent } from '~/server/email'
import { User, UserStatus } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { createEmailSubject } from '../email/createEmailSubject'

export default defineNitroPlugin(() => {
  startScheduler()
})

const inactiveStructuresScheduler = async () => {
  await createAccountReminderEmail()
}

const startScheduler = () => {
  const scheduler = useScheduler()
  scheduler.run(inactiveStructuresScheduler).dailyAt(3, 0)
}

// Send a reminder email to inactive users, 2 weeks after account creation
const createAccountReminderEmail = async () => {
  const inactiveUsers = await prismaClient.$transaction(async () => {
    const inactiveUsers = await UserRepo.prisma.findMany({
      where: {
        lastAccess: null,
        created: {
          lte: dayjs().subtract(2, 'week').toDate()
        },
        userActivities: {
          none: {}
        },
        accountReminderEmail: 0,
        status: UserStatus.Active
      },
      include: {
        structure: {
          select: { siret: true }
        }
      }
    })

    await UserRepo.prisma.updateMany({
      where: {
        id: {
          in: inactiveUsers.map((user: User) => user.id)
        }
      },
      data: {
        accountReminderEmail: 1
      }
    })

    return inactiveUsers
  })

  for (const user of inactiveUsers) {
    const userData = {
      ...user,
      structure: {
        siret: user.structure?.siret || 'Siret inconnu'
      }
    }
    await createEmail({
      to: user.email,
      subject: createEmailSubject(
        'Mon Suivi Social - Ouverture de votre compte'
      ),
      ...getUserCreationEmailContent(userData)
    })
  }
}
