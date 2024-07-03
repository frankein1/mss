import { z } from 'zod'
import {
  amountNumber,
  amountNumberCanBeNegative,
  stringConstraint,
  dateOrEmpty
} from '.'

export const getBudgetSchema = z.object({
  familyFileId: z.string().uuid()
})

export type GetBudgetInput = z.infer<typeof getBudgetSchema>

export const updateBudgetInfoSchema = z.object({
  id: z.string().uuid(),
  numberHouseholdMembers: amountNumber.nullish(),
  remainingAfterExpenses: amountNumberCanBeNegative.nullish(),
  savings: amountNumber.nullish(),
  overdraft: amountNumber.nullish(),
  banqueDeFrance: amountNumber.nullish(),
  familyQuotient: amountNumber.nullish()
})

export type UpdateBudgetInfoInput = z.infer<typeof updateBudgetInfoSchema>

const updateLoanOrDebtSchema = z.object({
  id: z.string().uuid(),
  type: stringConstraint.nullish(),
  amountTotal: amountNumber.nullish(),
  amountPerMonth: amountNumber.nullish(),
  dueDate: dateOrEmpty
})

export type UpdateLoanOrDebtInput = z.infer<typeof updateLoanOrDebtSchema>

export const updateBudgetExpensesSchema = z.object({
  id: z.string().uuid(),
  rent: amountNumber.nullish(),
  expenses: amountNumber.nullish(),
  water: amountNumber.nullish(),
  electricity: amountNumber.nullish(),
  gas: amountNumber.nullish(),
  fuelOrOther: amountNumber.nullish(),
  // Impôts
  housingTax: amountNumber.nullish(),
  propertyTax: amountNumber.nullish(),
  incomeTax: amountNumber.nullish(),

  // Assurances
  carInsurance: amountNumber.nullish(),
  homeInsurance: amountNumber.nullish(),
  deathInsurance: amountNumber.nullish(),
  retirementInsurance: amountNumber.nullish(),
  otherInsurance: amountNumber.nullish(),

  // Autres charges
  remittedAlimony: amountNumber.nullish(),
  healthInsurance: amountNumber.nullish(),
  phoneInternet: amountNumber.nullish(),
  schoolFees: amountNumber.nullish(),
  schoolCanteen: amountNumber.nullish(),
  other: amountNumber.nullish(),

  // Crédits et dettes
  loans: z.array(updateLoanOrDebtSchema),
  debts: z.array(updateLoanOrDebtSchema)
})

export type UpdateBudgetExpensesInput = z.infer<
  typeof updateBudgetExpensesSchema
>

export const updateBudgetIncomeSchema = z.object({
  id: z.string().uuid(),
  salary: amountNumber.nullish(),
  primeActivite: amountNumber.nullish(),

  // Pensions
  retirement: amountNumber.nullish(),
  alimony: amountNumber.nullish(),
  disability: amountNumber.nullish(),

  // Allocations
  unemployment: amountNumber.nullish(),
  ass: amountNumber.nullish(),
  rsa: amountNumber.nullish(),
  apl: amountNumber.nullish(),
  family: amountNumber.nullish(),
  aah: amountNumber.nullish(),
  aspa: amountNumber.nullish(),

  // Autre ressources
  dailyAllowance: amountNumber.nullish(),
  annuity: amountNumber.nullish(),
  other: amountNumber.nullish()
})

export type UpdateBudgetIncomeInput = z.infer<typeof updateBudgetIncomeSchema>
