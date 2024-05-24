<template>
  <div class="card card--rust fr-mb-2w">
    <h3 class="fr-h6 fr-m-0">Charges du foyer fiscal</h3>
    <span
      class="fr-h4 fr-m-0"
      :class="{ 'euro-symbol': total !== null }"
      >{{ total !== null ? euros(total) : '-' }}</span
    >
  </div>

  <BudgetCard
    class="fr-mb-2w"
    color="rust"
    title="Charges principales"
    :total="mainExpensesTotal"
    :keys="nonZeroExpensesKeys"
    :label-getter="(key: string) => budgetExpensesKeys.value(key)"
    :value-getter="(key: string) => expenses[key as ExpensesKey]"
    :edit-route="
      RoutePath.AppBeneficiaryBudgetExpensesEdit(beneficiaryId, expenses.id)
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
      RoutePath.AppBeneficiaryBudgetExpensesEdit(beneficiaryId, expenses.id)
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
      RoutePath.AppBeneficiaryBudgetExpensesEdit(beneficiaryId, expenses.id)
    "
  />
</template>

<script lang="ts" setup>
  import { ExpensesKey, BudgetExpenses } from '../types'
  import { RoutePath } from '~/utils/routing'
  import { budgetExpensesKeys } from '~/client/options'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { mainExpensesHaveBeenFilled } from '~/utils/budget'
  import { euros } from '~/utils/euros'

  const props = defineProps<{
    beneficiaryId: string
    expenses: BudgetExpenses
  }>()

  const nonZeroExpensesKeys = computed(() =>
    budgetExpensesKeys.keys.filter(
      key =>
        (prismaDecimalToNumber(props.expenses[key as ExpensesKey]) || 0) > 0
    )
  )

  const mainExpensesTotal = computed(() => {
    if (!mainExpensesHaveBeenFilled(props.expenses)) {
      return null
    }

    return nonZeroExpensesKeys.value.reduce((acc, cur) => {
      const expense = prismaDecimalToNumber(props.expenses[cur as ExpensesKey])
      return acc + (expense || 0)
    }, 0)
  })

  const loansTotal = computed(() =>
    props.expenses.loans.reduce((acc, cur) => {
      const amount = prismaDecimalToNumber(cur.amountPerMonth)
      return acc + (amount || 0)
    }, 0)
  )

  const debtsTotal = computed(() =>
    props.expenses.debts.reduce((acc, cur) => {
      const amount = prismaDecimalToNumber(cur.amountPerMonth)
      return acc + (amount || 0)
    }, 0)
  )

  const total = computed(() => {
    if (mainExpensesTotal.value === null && loansTotal.value === null) {
      return null
    }

    return (mainExpensesTotal.value || 0) + (loansTotal.value || 0)
  })
</script>

<style scoped lang="scss">
  @use '~/assets/style/card' as *;
</style>
