<template>
  <div class="beneficiary-budget--title">
    <img
      src="/pictograms/money.svg"
      class="img"
      alt=""
    />
    <h2 class="fr-m-0">Budget mensuel du foyer fiscal</h2>
  </div>

  <BudgetGeneralInformation :beneficiary-id="beneficiaryId" />
</template>

<script lang="ts" setup>
  defineProps<{
    beneficiaryId: string
  }>()
</script>

<style scoped>
  .beneficiary-budget--title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    margin-bottom: 1.25rem;

    > h2 {
      color: var(--primary);
    }
  }
</style>
