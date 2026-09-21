/**
 * One-shot cleanup for the archive notification bug.
 *
 * Until the fix, `getInactiveBeneficiaries` selected every beneficiary with a future
 * `archiveDueDate`, however far away it was. Clicking "conserver le dossier" (which sets
 * the due date a year ahead) therefore recreated an `ArchiveDueOneMonth` notification on
 * the next scheduler run, up to a year before the file was actually due to be archived.
 *
 * This script deletes the archive notifications whose effective archive date — recomputed
 * with the same `getArchiveDate` the scheduler uses — is more than a month away. Overdue
 * and genuinely upcoming notifications are left untouched, and the fixed scheduler will
 * recreate any notification that is still legitimate.
 *
 * Dry run by default: nothing is deleted until `--delete` is passed.
 *
 * Usage:
 *   pnpm tsx --tsconfig scheduler/tsconfig.json --env-file=.env \
 *     scripts/notifications/delete-early-archive-notifications.ts [--delete]
 */
import dayjs from 'dayjs'
import { NotificationType } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import { getArchiveDate } from '~~/scheduler/notification/helper'

const ARCHIVE_TYPES = [
  NotificationType.ArchiveDueOneMonth,
  NotificationType.ArchiveDueSevenDays,
  NotificationType.ArchiveDueToday
]

const main = async () => {
  const apply = process.argv.includes('--delete')
  const archiveDateLimit = dayjs().add(1, 'month')

  const notifications = await prismaClient.notification.findMany({
    where: { type: { in: ARCHIVE_TYPES } },
    select: {
      id: true,
      type: true,
      archiveDate: true,
      beneficiary: {
        select: {
          id: true,
          structureId: true,
          lastActivity: true,
          created: true,
          archiveDueDate: true
        }
      }
    }
  })

  const early = notifications.flatMap(notification => {
    const beneficiary = notification.beneficiary
    if (!beneficiary) {
      return []
    }
    // same fallback as the scheduler: no activity means the delay runs from `created`
    const lastActivity = beneficiary.lastActivity ?? beneficiary.created
    if (!lastActivity) {
      return []
    }

    const archiveDate = getArchiveDate(lastActivity, beneficiary.archiveDueDate)
    if (!dayjs(archiveDate).isAfter(archiveDateLimit)) {
      return []
    }
    return [{ ...notification, structureId: beneficiary.structureId }]
  })

  console.log(
    `\n${notifications.length} notification(s) d'archivage en base, ` +
      `dont ${early.length} créée(s) trop tôt.\n`
  )

  if (early.length === 0) {
    console.log('Rien à supprimer.\n')
    return
  }

  const countByStructure = new Map<string, number>()
  for (const { structureId } of early) {
    countByStructure.set(
      structureId,
      (countByStructure.get(structureId) ?? 0) + 1
    )
  }
  console.log('Par structure :')
  for (const [structureId, count] of countByStructure) {
    console.log(`  ${structureId} : ${count}`)
  }
  console.log('')

  if (!apply) {
    console.log(
      "Simulation : rien n'a été supprimé. Relancer avec --delete pour appliquer.\n"
    )
    return
  }

  const { count } = await prismaClient.notification.deleteMany({
    where: { id: { in: early.map(n => n.id) } }
  })
  console.log(`${count} notification(s) supprimée(s).\n`)
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => await prismaClient.$disconnect())
