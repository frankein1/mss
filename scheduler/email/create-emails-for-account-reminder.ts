import dayjs from 'dayjs'
import { UserRepo } from '~/server/database'
import { createEmail, createEmailSubject } from './utils'
import { getUserCreationEmailContent } from '~/server/email'
import type { User } from '@prisma/client'
import { UserStatus } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { withErrorCapture } from '../utils'

const createAccountReminderMails = async () => {
  const inactiveUsers = await prismaClient.$transaction(async () => {
    // TODO improve this query by removing user activities
    const inactiveUsers = await UserRepo.prisma.findMany({
      relationLoadStrategy: 'query',
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

/** Send a reminder email to inactive users, 2 weeks after account creation */
export default async function handler() {
  return await withErrorCapture(createAccountReminderMails)
}
