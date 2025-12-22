import dayjs from 'dayjs'
import { BeneficiaryRepo } from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'

export const getLastActivity = async ({
  ctx,
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) => {
  // NOTES :
  // si un social support est supprimé, le beneficiary.updated n'est pas mis à jour
  // si familyFile est mis à jour (ajout ou suppression d'un membre), le beneficiary.updated n'est pas mis à jour
  // Pas de champ "updated" pour la table Document

  const beneficiary = await getBeneficiaryWithActivityDates(beneficiaryId)
  return getBeneficiaryLastActivity(beneficiary)
}

export const getMostRecenttDate = (dates: Date[]): Date => {
  const unixMilliseconds = dates.map(date => dayjs(date).valueOf())
  const max = Math.max(...unixMilliseconds)
  return new Date(max)
}

export const getBeneficiaryLastActivity = (
  beneficiary: BeneficiaryWithActivityDates
) => {
  const socialSupportActivites = beneficiary.socialSupports.map(
    support => support.updated
  )
  const documentsActivites = beneficiary.documents.map(doc => doc.created)
  const incomesActivites = beneficiary.familyFile.budget
    ? beneficiary.familyFile.budget?.incomes.map(income => income.updated)
    : []

  const loanActivities = beneficiary.familyFile.budget?.expenses?.loans
    ? (beneficiary.familyFile.budget.expenses.loans
        .map(loan => loan.updated)
        .filter(Boolean) as Date[])
    : []

  const debtsActivities = beneficiary.familyFile.budget?.expenses?.debts
    ? (beneficiary.familyFile.budget.expenses.debts
        .map(debt => debt.updated)
        .filter(Boolean) as Date[])
    : []

  const customExpenseActivities = beneficiary.familyFile.budget?.expenses
    ?.customs
    ? (beneficiary.familyFile.budget.expenses.customs
        .map(custom => custom.updated)
        .filter(Boolean) as Date[])
    : []

  const customIncomeActivities = beneficiary.familyFile.budget?.incomes
    ? (beneficiary.familyFile.budget.incomes
        .flatMap(income => {
          if (income.customs) {
            return income.customs.map(custom => custom.updated)
          }
          return []
        })
        .filter(Boolean) as Date[])
    : []
  const workshopActivities = beneficiary.workshopAttendees
    ? (beneficiary.workshopAttendees
        .map(attendee => attendee.updated)
        .filter(Boolean) as Date[])
    : []

  const migrationDate = new Date('2024-06-03T23:06:59.476Z')
  const activities = [
    beneficiary.updated,
    beneficiary.created,
    beneficiary.familyFile.budget?.updated,
    beneficiary.familyFile.budget?.expenses?.updated,
    ...socialSupportActivites,
    ...documentsActivites,
    ...incomesActivites,
    ...loanActivities,
    ...debtsActivities,
    ...customExpenseActivities,
    ...customIncomeActivities,
    ...workshopActivities
  ]
    .filter(date => date != null && date.getTime() !== migrationDate.getTime())
    .filter(Boolean) as Date[]

  return getMostRecenttDate(activities)
}

export const getArchiveDate = (
  lastActivity: Date,
  archiveDueDate: Date | null
): Date => {
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
export type BeneficiaryWithActivityDates = Awaited<
  ReturnType<typeof getBeneficiaryWithActivityDates>
>

export const getBeneficiaryWithActivityDates = async (
  beneficiaryId: string
) => {
  return await BeneficiaryRepo.prisma.findUniqueOrThrow({
    where: { id: beneficiaryId },
    select: {
      updated: true,
      created: true,
      documents: {
        select: {
          created: true // Pas de champ "updated" pour les documents !
        }
      },
      socialSupports: {
        select: {
          updated: true
        }
      },
      familyFile: {
        select: {
          budget: {
            select: {
              updated: true, // informations générales uniquement
              expenses: {
                select: {
                  updated: true,
                  loans: {
                    select: {
                      updated: true
                    }
                  },
                  debts: {
                    select: {
                      updated: true
                    }
                  },
                  customs: {
                    select: {
                      updated: true
                    }
                  }
                }
              },
              incomes: {
                select: {
                  updated: true,
                  customs: {
                    select: {
                      updated: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      workshopAttendees: {
        select: {
          updated: true
        }
      }
    }
  })
}
