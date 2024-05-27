<template>
  <div>
    <BudgetExpensesMainForm :total="mainTotal" />

    <BudgetExpensesLoansForm :total="loansTotal" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{ mainTotal: number | null; loansTotal: number | null }>()
</script>
