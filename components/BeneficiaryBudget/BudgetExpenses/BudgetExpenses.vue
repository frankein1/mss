<template>
  <div class="budget-expenses-total">
    <h3 class="fr-h6 fr-m-0">Charges du foyer fiscal</h3>
    <span class="budget-expenses-total__value fr-h4 fr-m-0">{{
      total || '-'
    }}</span>
  </div>

  <div class="feature-section bg-color-white budget-expenses-details">
    <div class="budget-expenses-details__title">
      <h4 class="fr-text--lead fr-m-0">Détails des charges</h4>
    </div>

    <ul class="budget-expenses-details__items">
      <li
        v-for="(category, index) in nonZeroExpensesKeys"
        :key="index"
        class="budget-expenses-details__item"
      >
        <span>{{ budgetExpensesKeys.value(category) }}</span>
        <span class="budget-expenses-details__item__value">{{
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
  </div>
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

<style scoped>
  .budget-expenses-total {
    padding: 2rem 1.5rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: var(--rust);
    margin-bottom: 1rem;

    > * {
      color: white;
    }
  }

  .budget-expenses-total__value::after {
    content: '\00a0€';
  }

  .budget-expenses-details {
    border-width: 0;
    border-bottom: 0.25rem solid var(--rust);

    > ul {
      list-style-type: none;
      padding-inline-start: unset;
    }
  }

  .budget-expenses-details__title {
    display: flex;
    justify-content: space-between;
  }

  .budget-expenses-details__items > *:not(:last-child) {
    border-bottom: 0.0625rem;
    border-bottom-style: solid;
    border-bottom-color: var(--border-default-grey);
  }

  .budget-expenses-details__item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
  }

  .budget-expenses-details__item__value {
    font-weight: var(--bold);

    &::after {
      content: '\00a0€';
    }
  }

  .budget-expenses-details__action {
    display: flex;
    justify-content: flex-end;

    > .fr-btn--tertiary-no-outline {
      color: var(--rust);
    }
  }
</style>
