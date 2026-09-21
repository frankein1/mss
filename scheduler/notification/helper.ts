import { NotificationType, UserRole, UserStatus } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import dayjs from 'dayjs'
import { NotificationRepo } from '~~/server/database'

// Find beneficiaries whose effective archive date (see getArchiveDate) is due within a month.
// The database filter is a superset: the archive date depends on both lastActivity and
// archiveDueDate, so the exact comparison is done in memory.
// - without archive due date, the archive date is lastActivity + 2 years, so it is due within
//   a month once the beneficiary has been inactive for 23 months
// - with an archive due date, the archive date is either that due date, or lastActivity + 2 years
//   when there has been activity since the due date was set
export const getInactiveBeneficiaries = async () => {
  const archiveDateLimit = dayjs().add(1, 'month')
  const inactivityLimit = dayjs().subtract(23, 'months').toDate()

  return await prismaClient.beneficiary
    .findMany({
      where: {
        OR: [
          {
            archiveDueDate: null,
            lastActivity: { lte: inactivityLimit }
          },
          {
            archiveDueDate: null,
            lastActivity: null,
            created: { lte: inactivityLimit }
          },
          {
            archiveDueDate: {
              lte: archiveDateLimit.toDate()
            }
          }
        ]
      },
      select: select()
    })
    .then(beneficiaries =>
      beneficiaries
        .map(b => {
          // beneficiaries without any activity fall back to their creation date
          const lastActivity = b.lastActivity ?? b.created
          return {
            ...b,
            lastActivity,
            archiveDate: getArchiveDate(lastActivity, b.archiveDueDate)
          }
        })
        .filter(b => !dayjs(b.archiveDate).isAfter(archiveDateLimit))
        .map(b => {
          return {
            ...b,
            structure: {
              name: b.structure.name
            },
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
          // beneficiaries without any activity fall back to their creation date
          const lastActivity =
            n.beneficiary.lastActivity ?? n.beneficiary.created
          return {
            id: n.beneficiary.id,
            structure: {
              name: n.beneficiary.structure?.name
            },
            archiveDate: getArchiveDate(
              lastActivity,
              n.beneficiary.archiveDueDate
            ),
            referentIds: [
              ...new Set([
                // family file referents except reception agents
                ...n.beneficiary.familyFile.referents
                  .filter(referent =>
                    getArchivePermission(referent, lastActivity)
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
    created: true,
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
