import dayjs from 'dayjs'
import { StructureRepo } from '~/server/database'
import { useScheduler } from '#scheduler'
import { createEmail } from '~/server/query'
import { getInactiveStructureAlert } from '~/server/email'

export default defineNitroPlugin(() => {
  startScheduler()
})

async function inactiveStructuresScheduler() {
  await sendEmail(dayjs().subtract(6, 'month').toDate(), 0)
  await sendEmail(dayjs().subtract(6, 'month').subtract(2, 'week').toDate(), 1)
}

function startScheduler() {
  const scheduler = useScheduler()

  scheduler.run(inactiveStructuresScheduler).dailyAt(3, 0)
}

async function sendEmail(date: Date, deactivationAlertEmail: number) {
  const inactiveStructures = await StructureRepo.prisma.findMany({
    where: {
      lastAccess: {
        lte: date
      },
      deactivationAlertEmail
    },
    select: { id: true, users: true }
  })

  const users = inactiveStructures.flatMap(s => s.users)

  for (const user of users) {
    await createEmail({
      to: user.email,
      subject: 'Votre espace de travail sur Mon Suivi Social va être supprimé',
      ...getInactiveStructureAlert()
    })
  }

  await StructureRepo.prisma.updateMany({
    where: {
      id: {
        in: inactiveStructures.map(s => s.id)
      }
    },
    data: {
      deactivationAlertEmail: deactivationAlertEmail + 1
    }
  })
}
