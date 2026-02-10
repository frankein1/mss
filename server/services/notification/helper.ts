import { NotificationType, UserRole, UserStatus } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import dayjs from 'dayjs'
import { NotificationRepo } from '~/server/database'

// Find beneficiary with no archive due date or past due date (means delay hasnt been set or is past due)
// They must be inactive for more than 23 months (beacause notification 1 month before the 2 years of inactivity)
export const getInactiveBeneficiaries = async () => {
  return await prismaClient.beneficiary
    .findMany({
      where: {
        OR: [
          {
            archiveDueDate: null,
            lastActivity: {
              lt: dayjs().subtract(23, 'months').toDate()
            }
          },
          {
            archiveDueDate: {
              gte: dayjs().subtract(1, 'month').toDate()
            }
          }
        ]
      },
      select: select()
    })
    .then(beneficiaries =>
      beneficiaries
        .filter(
          b =>
            b.archiveDueDate == null ||
            (b.archiveDueDate != null &&
              dayjs(b.lastActivity).isBefore(
                dayjs(b.archiveDueDate).subtract(1, 'year')
              ))
        )
        .map(b => {
          return {
            ...b,
            structure: {
              name: b.structure.name
            },
            archiveDate: getArchiveDate(b.lastActivity, b.archiveDueDate),
            referentIds: [
              ...new Set([
                // family file referents except reception agents

                ...b.familyFile.referents
                  .filter(referent =>
                    getArchivePermission(referent, b.lastActivity)
                  )
                  .map(r => r.id),
                // structure managers
                ...b.structure.users.map(u => u.id)
              ])
            ]
          }
        })
    )
}

export const getInactiveBeneficiariesWithOneMonthNotification = async () => {
  return await NotificationRepo.prisma
    .findMany({
      distinct: ['beneficiaryId'],
      where: {
        type: NotificationType.ArchiveDueOneMonth
      },
      select: {
        archiveDate: true,
        beneficiaryId: true,
        recipientId: true,
        beneficiary: {
          select: select()
        }
      }
    })
    .then(notifications =>
      notifications.map(n => {
        if (n.beneficiary) {
          return {
            id: n.beneficiary.id,
            structure: {
              name: n.beneficiary.structure?.name
            },
            archiveDate: getArchiveDate(
              n.beneficiary.lastActivity,
              n.beneficiary.archiveDueDate
            ),
            referentIds: [
              ...new Set([
                // family file referents except reception agents
                ...n.beneficiary.familyFile.referents
                  .filter(referent =>
                    getArchivePermission(referent, n.beneficiary!.lastActivity)
                  )
                  .map(r => r.id),
                // structure managers
                ...n.beneficiary.structure.users.map(u => u.id)
              ])
            ]
          }
        }
      })
    )
}

export const getArchiveDate = (
  lastActivity: Date | null,
  archiveDueDate: Date | null
): Date => {
  if (!lastActivity) {
    throw new Error('lastActivity is null')
  }
  // il n'y a pas eu de conservation du dossier
  if (!archiveDueDate) {
    return dayjs(lastActivity).add(2, 'year').toDate()
  }
  // il y a eu une activité depuis l'action de conservation du dossier
  if (lastActivity > dayjs(archiveDueDate).subtract(1, 'year').toDate()) {
    return dayjs(lastActivity).add(2, 'year').toDate()
  }
  // il n'y a pas eu d'activité depuis l'action de conservation du dossier
  return archiveDueDate
}

const getArchivePermission = (
  referent: {
    role: UserRole
  },
  beneficiaryLastActivity: Date | null
): boolean => {
  if (!beneficiaryLastActivity) {
    throw new Error('lastActivity is null')
  }

  if (referent.role === UserRole.ReceptionAgent) {
    return false
  }
  if (referent.role === UserRole.StructureManager) {
    return true
  }
  if (
    (referent.role === UserRole.SocialWorker ||
      referent.role === UserRole.Referent ||
      referent.role === UserRole.Instructor) &&
    dayjs(beneficiaryLastActivity).isBefore(dayjs().subtract(2, 'year'))
  ) {
    return true
  }
  return false
}

export const select = () => {
  return {
    id: true,
    lastActivity: true,
    archiveDueDate: true,
    structure: {
      select: {
        name: true,
        users: {
          where: {
            role: UserRole.StructureManager
          },
          select: { id: true }
        }
      }
    },
    familyFile: {
      select: {
        referents: {
          where: { status: UserStatus.Active },
          select: { id: true, role: true }
        }
      }
    }
  }
}
