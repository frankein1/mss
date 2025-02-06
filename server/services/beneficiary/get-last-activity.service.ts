import { BeneficiaryRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security'

export const getLastActivity = async ({
  ctx: { user },
  beneficiaryId
}: {
  ctx: SecurityRuleContext
  beneficiaryId: string
}) => {
  // NOTES :
  // si un social support est supprimé, le beneficiary.updated n'est pas mis à jour
  // si familyFile est mis à jour (ajout ou suppression d'un membre), le beneficiary.updated n'est pas mis à jour
  // Pas de champ "updated" pour la table Document

  const beneficiary = await BeneficiaryRepo.findWithNoDraftCondition(user, {
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

  return getlatestDate(activities)
}

const getlatestDate = (dates: Date[]) => {
  return dates.reduce((max, current) => (current > max ? current : max))
}
