import { Prisma } from '@prisma/client'
import { fixturesBudgets, fixturesBeneficiaryRelatives } from './'

export const fixturesBudgetIncomes = [
  {
    id: 'fdcaf854-27c9-4f7c-aa1d-8ebf9f1e94d7',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[0].id
  },
  {
    id: '0c78fca9-625f-4afd-a8ad-7939ad7b543b',
    type: 'HouseholdMember',
    budgetId: fixturesBudgets[0].id,
    householdMemberId: fixturesBeneficiaryRelatives[0].id
  },
  {
    id: '936d7273-267e-427b-8138-46df57427795',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[1].id
  },
  {
    id: '47c28b3f-98fb-47ab-9620-542736870d41',
    type: 'HouseholdMember',
    budgetId: fixturesBudgets[1].id,
    householdMemberId: fixturesBeneficiaryRelatives[1].id
  },
  {
    id: 'ce88cf69-5a3b-42b4-b617-8d68a1f6d2a7',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[2].id
  },
  {
    id: '9cc29be2-95c6-4e02-9ace-17afc4ea8a14',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[3].id
  },
  {
    id: 'e804eba8-8449-4430-897e-fed1e13265fa',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[4].id
  },
  {
    id: 'f67c52d3-7983-4436-b76b-102f038256b7',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[5].id
  },
  {
    id: 'f488f1a6-352c-4ed8-bec8-99d47524cde1',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[6].id
  },
  {
    id: '7308d77d-054d-46ec-bee0-afb7e20e7400',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[7].id
  },
  {
    id: '8ee1e48e-a8b3-4412-baca-9419476c424d',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[8].id
  },
  {
    id: '9bdd6dd8-e94c-45a6-ae36-c4a46158fb43',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[9].id
  },
  {
    id: '5a142c9d-0d90-4495-8eb7-8b1eecad1306',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[10].id
  },
  {
    id: '27f9272f-70c6-4e53-95f2-b26642b59645',
    type: 'HouseholdMember',
    budgetId: fixturesBudgets[10].id,
    householdMemberId: fixturesBeneficiaryRelatives[2].id
  },
  {
    id: 'd43c14e2-8327-40cc-90a0-d9833408d7b5',
    type: 'HouseholdMember',
    budgetId: fixturesBudgets[10].id,
    householdMemberId: fixturesBeneficiaryRelatives[3].id
  },
  {
    id: '13c43d66-e931-4432-bb71-fc2140352a53',
    type: 'Beneficiary',
    budgetId: fixturesBudgets[11].id
  }
] satisfies Prisma.BudgetIncomeUncheckedCreateInput[]
