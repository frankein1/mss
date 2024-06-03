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
      RoutePath.AppBeneficiaryBudgetExpensesEdit(
        beneficiaryId,
        expenses.id,
        BeneficiaryBudgetSection.Loans
      )
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
      RoutePath.AppBeneficiaryBudgetExpensesEdit(
        beneficiaryId,
        expenses.id,
        BeneficiaryBudgetSection.Debts
      )
    "
  />
</template>

<script lang="ts" setup>
  import { ExpensesKey, BudgetExpenses } from '../types'
  import { RoutePath } from '~/utils/routing'
  import { budgetExpensesKeys } from '~/client/options'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { incrementBudgetTotal } from '~/utils/budget'
  import { euros } from '~/utils/euros'
  import { BeneficiaryBudgetSection } from '~/utils/constants/beneficiary'

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

  const mainExpensesTotal = computed(() =>
    nonZeroExpensesKeys.value.reduce<number | null>(
      (acc, cur) =>
        incrementBudgetTotal(acc, props.expenses[cur as ExpensesKey]),
      null
    )
  )

  const loansTotal = computed(() =>
    props.expenses.loans.reduce<number | null>(
      (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
      null
    )
  )

  const debtsTotal = computed(() =>
    props.expenses.debts.reduce<number | null>(
      (acc, cur) => incrementBudgetTotal(acc, cur.amountPerMonth),
      null
    )
  )

  const total = computed(() => {
    if (
      mainExpensesTotal.value === null &&
      loansTotal.value === null &&
      debtsTotal.value === null
    ) {
      return null
    }

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
