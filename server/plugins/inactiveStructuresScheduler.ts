import dayjs from 'dayjs'
import { StructureRepo } from '~/server/database'
import { useScheduler } from '#scheduler'
import { createEmail } from '~/server/query'
import { getInactiveStructureAlert } from '~/server/email'
import { UserStatus } from '@prisma/client'
import { createEmailSubject } from '../email/createEmailSubject'

export default defineNitroPlugin(() => {
  startScheduler()
})

async function inactiveStructuresScheduler() {
  await sendFirstEmail()
  await sendSecondEmail()
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(inactiveStructuresScheduler).dailyAt(3, 0)
}

async function sendFirstEmail() {
  const inactiveStructures = await StructureRepo.prisma.findMany({
    where: {
      OR: [
        {
          lastAccess: {
            lte: dayjs().subtract(6, 'month').toDate()
          }
        },
        {
          lastAccess: null,
          created: {
            lte: dayjs().subtract(6, 'month').toDate()
          }
        }
      ],
      deactivationAlertEmail: 0
    },
    select: {
      id: true,
      users: {
        where: {
          status: UserStatus.Active
        }
      }
    }
  })

  await sendEmail(inactiveStructures.flatMap(s => s.users))

  await StructureRepo.prisma.updateMany({
    where: {
      id: {
        in: inactiveStructures.map(s => s.id)
      }
    },
    data: {
      deactivationAlertEmailDate: new Date(),
      deactivationAlertEmail: 1
    }
  })
}

async function sendSecondEmail() {
  const inactiveStructures = await StructureRepo.prisma.findMany({
    where: {
      deactivationAlertEmailDate: {
        lte: dayjs().subtract(2, 'week').toDate()
      },
      deactivationAlertEmail: 1
    },
    select: {
      id: true,
      users: {
        where: {
          status: UserStatus.Active
        }
      }
    }
  })

  await sendEmail(inactiveStructures.flatMap(s => s.users))

  await StructureRepo.prisma.updateMany({
    where: {
      id: {
        in: inactiveStructures.map(s => s.id)
      }
    },
    data: {
      deactivationAlertEmail: 2
    }
  })
}

async function sendEmail(users: { email: string }[]) {
  for (const user of users) {
    await createEmail({
      to: user.email,
      subject: createEmailSubject(
        'Votre espace de travail sur Mon Suivi Social va être supprimé'
      ),
      ...getInactiveStructureAlert()
    })
  }
}
