import dayjs from 'dayjs'
import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'

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

  const beneficiary = await getBeneficiaryWithActivityDates(ctx, beneficiaryId)
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

  const activities = [
    beneficiary.updated,
    beneficiary.familyFile.budget?.updated,
    beneficiary.familyFile.budget?.expenses?.updated,
    ...socialSupportActivites,
    ...documentsActivites,
    ...incomesActivites
  ].filter(Boolean) as Date[]

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
type BeneficiaryWithActivityDates = Awaited<
  ReturnType<typeof getBeneficiaryWithActivityDates>
>

export const getBeneficiaryWithActivityDates = async (
  ctx: SecurityRuleContext,
  beneficiaryId: string
) => {
  return await BeneficiaryRepo.findWithNoDraftCondition(ctx.user, {
    where: { id: beneficiaryId },
    select: {
      updated: true,
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
                  updated: true
                }
              },
              incomes: {
                select: {
                  updated: true
                }
              }
            }
          }
        }
      }
    }
  })
}
