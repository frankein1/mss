import { router, protectedProcedure } from '~/server/trpc'
import { budgetRoutes } from '~/server/route'

export const budgetRouter = router({
  updateInfo: protectedProcedure
    .input(budgetRoutes.updateInfo.inputValidation)
    .mutation(budgetRoutes.updateInfo.execute),
  updateIncome: protectedProcedure
    .input(budgetRoutes.updateIncome.inputValidation)
    .mutation(budgetRoutes.updateIncome.execute),
  deleteIncome: protectedProcedure
    .input(budgetRoutes.deleteIncome.inputValidation)
    .mutation(budgetRoutes.deleteIncome.execute),
  updateExpenses: protectedProcedure
    .input(budgetRoutes.updateExpenses.inputValidation)
    .mutation(budgetRoutes.updateExpenses.execute),
  getBudget: protectedProcedure
    .input(budgetRoutes.getBudget.inputValidation)
    .query(budgetRoutes.getBudget.execute),
  getInfo: protectedProcedure
    .input(budgetRoutes.getInfo.inputValidation)
    .query(budgetRoutes.getInfo.execute),
  getExpenses: protectedProcedure
    .input(budgetRoutes.getExpenses.inputValidation)
    .query(budgetRoutes.getExpenses.execute),
  getIncome: protectedProcedure
    .input(budgetRoutes.getIncome.inputValidation)
    .query(budgetRoutes.getIncome.execute),
  createBudgetIncome: protectedProcedure
    .input(budgetRoutes.createBudgetIncome.inputValidation)
    .mutation(budgetRoutes.createBudgetIncome.execute)
})
