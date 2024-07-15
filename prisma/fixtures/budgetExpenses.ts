import { Prisma } from '@prisma/client'
import { fixturesBudgets } from './'

export const fixturesBudgetExpenses = [
  {
    id: 'e2361b49-9723-4a90-9454-ade89407fbf4',
    budgetId: fixturesBudgets[0].id
  },
  {
    id: 'ea7d0dc5-d67f-4c2d-bbdf-b5a453e85f2f',
    budgetId: fixturesBudgets[1].id
  },
  {
    id: 'c9c442fa-23ea-4a38-b045-4b14e85a80d4',
    budgetId: fixturesBudgets[2].id
  },
  {
    id: '13a1b958-0994-4a31-9e6b-cdad992f734e',
    budgetId: fixturesBudgets[3].id
  },
  {
    id: 'b05f56ca-1b8e-4166-a4f2-35cfea93b212',
    budgetId: fixturesBudgets[4].id
  },
  {
    id: 'e9121823-8185-4a3e-b0b3-f71b968f05d3',
    budgetId: fixturesBudgets[5].id
  },
  {
    id: '016729d1-0888-4cc5-847c-5d1fa55b9d0d',
    budgetId: fixturesBudgets[6].id
  },
  {
    id: '474d8ce5-35dc-4fda-8f84-15201e690a1e',
    budgetId: fixturesBudgets[7].id
  },
  {
    id: '1bc3b157-e69a-440c-bd5c-4fcf4b016055',
    budgetId: fixturesBudgets[8].id
  },
  {
    id: '1eb26031-a91d-4527-a5c7-45e690f591f1',
    budgetId: fixturesBudgets[9].id
  },
  {
    id: '85c51414-4caf-441a-b6b1-7c0a3da86a03',
    budgetId: fixturesBudgets[10].id
  },
  {
    id: 'af7fa502-6a30-46b4-a11c-a27ee518f176',
    budgetId: fixturesBudgets[11].id
  }
] satisfies Prisma.BudgetExpensesUncheckedCreateInput[]
