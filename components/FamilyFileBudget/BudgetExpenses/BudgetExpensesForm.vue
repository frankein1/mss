<template>
  <div>
    <BudgetExpensesMainForm :total="mainTotal" />

    <BudgetExpensesLoansForm :total="loansTotal" />

    <BudgetExpensesDebtsForm :total="debtsTotal" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    mainTotal: number | null
    loansTotal: number | null
    debtsTotal: number | null
  }>()
</script>
