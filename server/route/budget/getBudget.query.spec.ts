import {
  describeBudgetAuthorizations,
  budgetFixtures
} from './budget-test-helpers'

describeBudgetAuthorizations('getBudget', {
  ownStructure: caller =>
    caller.budget.getBudget({
      familyFileId: budgetFixtures.ownStructure.familyFileId
    }),
  otherStructure: caller =>
    caller.budget.getBudget({
      familyFileId: budgetFixtures.otherStructure.familyFileId
    }),
  referentAssigned: caller =>
    caller.budget.getBudget({
      familyFileId: budgetFixtures.referentAssigned.familyFileId
    })
})
