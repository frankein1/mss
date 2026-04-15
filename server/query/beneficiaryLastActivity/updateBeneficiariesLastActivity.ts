import { UserActivityObject } from '@prisma/client'
import { prismaClient } from '~/server/prisma'

export const updateBeneficiariesLastActivity = async (
  beneficiaryIds: string[]
) => {
  await prismaClient.beneficiary.updateMany({
    where: {
      id: {
        in: beneficiaryIds
      }
    },
    data: {
      lastActivity: new Date()
    }
  })
}

export const handleBeneficiariesLastActivityUpdate = async ({
  target,
  input,
  objectId,
  key
}: {
  target: UserActivityObject
  input: Record<string, unknown>
  objectId: string
  key: string
}) => {
  // Beneficiary
  if (target === UserActivityObject.Beneficiary) {
    if (key === 'beneficiary.linkToFamilyFile' && input.beneficiaryId) {
      await updateBeneficiariesLastActivity([input.beneficiaryId])
      return
    }
    if (
      key === 'beneficiary.updateEntourage' ||
      key === 'beneficiary.createEntourage' ||
      key === 'beneficiary.updateExternalOrganisations' ||
      key === 'beneficiary.updateGeneralInformation' ||
      key === 'beneficiary.updateHealth' ||
      key === 'beneficiary.updateOccupationIncome' ||
      key === 'beneficiary.updateTaxHousehold'
    ) {
      await updateBeneficiariesLastActivity([objectId])
      return
    }
  }

  // Budget
  if (
    target === UserActivityObject.Budget ||
    target === UserActivityObject.BudgetExpenses ||
    target === UserActivityObject.BudgetIncome
  ) {
    if (key === 'beneficiary.createBudgetIncome' && input.beneficiaryId) {
      await updateBeneficiariesLastActivity([input.beneficiaryId])
      return
    }
    if (key === 'budget.updateInfo') {
      const budget = await prismaClient.budget.findUniqueOrThrow({
        where: { id: objectId },
        select: {
          familyFile: {
            select: {
              beneficiaries: {
                select: {
                  id: true
                }
              }
            }
          }
        }
      })
      await updateBeneficiariesLastActivity(
        budget.familyFile.beneficiaries.map(b => b.id)
      )
      return
    }
    if (key === 'budget.updateExpenses') {
      const budgetExpenses =
        await prismaClient.budgetExpenses.findUniqueOrThrow({
          where: { id: objectId },
          select: {
            budget: {
              select: {
                familyFile: {
                  select: {
                    beneficiaries: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              }
            }
          }
        })
      await updateBeneficiariesLastActivity(
        budgetExpenses.budget.familyFile.beneficiaries.map(b => b.id)
      )
      return
    }
    if (key === 'budget.updateIncome') {
      const budgetIncomes = await prismaClient.budgetIncome.findUniqueOrThrow({
        where: { id: objectId },
        select: {
          budget: {
            select: {
              familyFile: {
                select: {
                  beneficiaries: {
                    select: {
                      id: true
                    }
                  }
                }
              }
            }
          }
        }
      })
      await updateBeneficiariesLastActivity(
        budgetIncomes.budget.familyFile.beneficiaries.map(b => b.id)
      )
      return
    }
  }

  // Documents
  if (target === UserActivityObject.Document) {
    if (key === 'document.update' && input.beneficiaryId) {
      await updateBeneficiariesLastActivity([input.beneficiaryId])
      return
    }
  }

  // FamilyFile
  if (target === UserActivityObject.FamilyFile) {
    if (key === 'file.split') {
      await updateBeneficiariesLastActivity([objectId])
      return
    }
  }

  // Folloup + HelpRequest + HousingHelpRequest
  if (
    target === UserActivityObject.Followup ||
    target === UserActivityObject.HelpRequest ||
    target === UserActivityObject.HousingHelpRequest
  ) {
    if (
      (key === 'followup.create' ||
        key === 'followup.update' ||
        key === 'helpRequest.create' ||
        key === 'helpRequest.update' ||
        key === 'housingHelpRequest.create' ||
        key === 'housingHelpRequest.update') &&
      input.beneficiaryId
    ) {
      await updateBeneficiariesLastActivity([input.beneficiaryId])
      return
    }
  }

  // Add beneficiary to a workshop
  if (target === UserActivityObject.Workshop) {
    if (key === 'workshop.createBeneficiaryAttendee' && input.beneficiaryId) {
      await updateBeneficiariesLastActivity([input.beneficiaryId])
      return
    }
    if (
      key === 'workshop.updateAttendeeAttendance' ||
      key === 'workshop.updateAttendee'
    ) {
      const attendee = await prismaClient.workshopAttendee.findUniqueOrThrow({
        where: { id: objectId },
        select: { beneficiary: { select: { id: true } } }
      })
      if (attendee.beneficiary === null) {
        return
      }
      await updateBeneficiariesLastActivity([attendee.beneficiary.id])
      return
    }
  }

  // RDVSP
  if (target === UserActivityObject.Appointment) {
    if (key === 'rdvsp.planApppointment' && input.beneficiaryId) {
      await updateBeneficiariesLastActivity([input.beneficiaryId])
      return
    }
  }
}
