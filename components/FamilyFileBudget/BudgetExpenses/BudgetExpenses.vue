<template>
  <div class="card card--rust fr-mb-2w">
    <h3 class="fr-h6 fr-m-0">Charges du foyer fiscal</h3>
    <span class="fr-h4 fr-m-0 euro-symbol">{{ euros(total) }}</span>
  </div>

  <BudgetCard
    class="fr-mb-2w"
    color="rust"
    title="Charges principales"
    :total="mainExpensesTotal"
    :items="expensesItems"
    :edit-route="
      routes.budget.AppFileBudgetExpensesEdit.path(familyFileId, expenses.id)
    "
  />

  <BudgetCard
    class="fr-mb-2w"
    has-subsections
    color="rust"
    title="Crédit(s)"
    :total="loansTotal"
    :subsection-items="expenses.loans"
    :edit-route="
      routes.budget.AppFileBudgetExpensesEdit.path(familyFileId, expenses.id) +
      '#credits'
    "
  />

  <BudgetCard
    class="fr-mb-2w"
    has-subsections
    color="rust"
    title="Dette(s)"
    :total="debtsTotal"
    :subsection-items="expenses.debts"
    :edit-route="
      routes.budget.AppFileBudgetExpensesEdit.path(familyFileId, expenses.id) +
      '#dettes'
    "
  />
</template>

<script lang="ts" setup>
  import type { ExpensesKey, BudgetExpenses } from '../types'
  import { budgetExpensesKeys } from '~/client/options'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { incrementBudgetTotal } from '~/utils/budget'
  import { euros } from '~/utils/euros'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    familyFileId: string
    expenses: BudgetExpenses
  }>()

  const getExpenses = () => {
    const keys = budgetExpensesKeys.keys.filter(
      key =>
        (prismaDecimalToNumber(props.expenses[key as ExpensesKey]) || 0) > 0
    )
    const regularExpenses = keys.map(key => {
      return {
        key: key,
        label: budgetExpensesKeys.value(key) || '',
        amount: (props.expenses[key as ExpensesKey] || 0) as number
      }
    })
    const customExpenses = props.expenses.customs.map(expense => {
      return {
        key: expense.expensesId,
        label: expense.type || '',
        amount: Number(expense.amount) || 0
      }
    })
    return [...regularExpenses, ...customExpenses]
  }

  const expensesItems = computed(() => getExpenses())

  const mainExpensesTotal = computed(
    () =>
      expensesItems.value.reduce<number | null>(
        (acc, cur) => incrementBudgetTotal(acc, cur.amount),
        null
      ) || 0
  )

  const loansTotal = computed(
    () =>
      props.expenses.loans.reduce<number | null>(
        (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
        null
      ) || 0
  )

  const debtsTotal = computed(
    () =>
      props.expenses.debts.reduce<number | null>(
        (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
        null
      ) || 0
  )

  const total = computed(() => {
    return (
      (mainExpensesTotal.value || 0) +
      (loansTotal.value || 0) +
      (debtsTotal.value || 0)
    )
  })
</script>

<style scoped lang="scss">
  @use '~/assets/style/card' as *;
</style>
