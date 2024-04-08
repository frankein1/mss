<template>
  <div class="card card--rust fr-mb-2w">
    <h3 class="fr-h6 fr-m-0">Charges du foyer fiscal</h3>
    <span class="euro-symbol fr-h4 fr-m-0">{{ total || '-' }}</span>
  </div>

  <section class="card-outline card-outline--rust">
    <div class="budget-expenses-details__title">
      <h4 class="fr-text--lead fr-m-0">Détails des charges</h4>
    </div>

    <ul class="list-styled">
      <li
        v-for="(category, index) in nonZeroExpensesKeys"
        :key="index"
      >
        <span>{{ budgetExpensesKeys.value(category) }}</span>
        <span class="budget-expenses-details__item__value euro-symbol">{{
          expenses[category as ExpensesKey]
        }}</span>
      </li>
    </ul>

    <div class="budget-expenses-details__action">
      <NuxtLink
        :to="
          RoutePath.AppBeneficiaryBudgetExpensesEdit(beneficiaryId, expenses.id)
        "
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-edit-line"
        title="Modifier"
      >
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { RoutePath } from '~/utils/routing'
  import { budgetExpensesKeys } from '~/client/options'
  import { ExpensesKey, BudgetExpenses } from '~/types/budget'
  import { prismaDecimalToNumber } from '~/utils/prisma'

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

  const total = computed(() => {
    return nonZeroExpensesKeys.value.reduce((acc, cur) => {
      const expense = prismaDecimalToNumber(props.expenses[cur as ExpensesKey])
      return acc + (expense || 0)
    }, 0)
  })
</script>

<style scoped lang="scss">
  @use '~/assets/style/card' as *;
  @use '~/assets/style/list' as *;

  .budget-expenses-details__title {
    display: flex;
    justify-content: space-between;
  }

  .budget-expenses-details__item__value {
    font-weight: var(--bold);
  }

  .budget-expenses-details__action {
    display: flex;
    justify-content: flex-end;

    > .fr-btn {
      color: var(--rust);
    }
  }
</style>
