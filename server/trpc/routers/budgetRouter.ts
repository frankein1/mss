import { router, protectedProcedure } from '~/server/trpc'
import { budgetRoutes } from '~/server/route'

export const budgetRouter = router({
  updateInfo: protectedProcedure
    .input(budgetRoutes.updateInfo.inputValidation)
    .mutation(budgetRoutes.updateInfo.execute),
  updateIncome: protectedProcedure
    .input(budgetRoutes.updateIncome.inputValidation)
    .mutation(budgetRoutes.updateIncome.execute),
  updateExpenses: protectedProcedure
    .input(budgetRoutes.updateExpenses.inputValidation)
    .mutation(budgetRoutes.updateExpenses.execute),
  getBudget: protectedProcedure
    .input(budgetRoutes.getBudget.inputValidation)
    .query(budgetRoutes.getBudget.execute),
  getBudgetId: protectedProcedure
    .input(budgetRoutes.getBudgetId.inputValidation)
    .query(budgetRoutes.getBudgetId.execute),
  getInfo: protectedProcedure
    .input(budgetRoutes.getInfo.inputValidation)
    .query(budgetRoutes.getInfo.execute),
  getExpenses: protectedProcedure
    .input(budgetRoutes.getExpenses.inputValidation)
    .query(budgetRoutes.getExpenses.execute),
  getIncome: protectedProcedure
    .input(budgetRoutes.getIncome.inputValidation)
    .query(budgetRoutes.getIncome.execute)
})
