<template>
  <div>
    <BudgetExpensesMainForm :total="mainTotal" />

    <BudgetExpensesLoansForm
      id="credits"
      :total="loansTotal"
    />

    <BudgetExpensesDebtsForm
      id="dettes"
      :total="debtsTotal"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    mainTotal: number | null
    loansTotal: number | null
    debtsTotal: number | null
  }>()

  onMounted(() => {
    if (window.location.hash == '#dettes') {
      const detteElement = document.getElementById('dettes')
      if (detteElement) {
        detteElement.scrollIntoView()
      }
      return
    }
    if (window.location.hash == '#credits') {
      const creditElement = document.getElementById('credits')
      if (creditElement) {
        creditElement.scrollIntoView()
      }
      return
    }
  })
</script>
