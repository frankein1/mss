<template>
  <section class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        :name="`customs[${index}].type`"
        :label="budgetCustomExpensesKeys.byKey.type"
      />
    </div>
    <div class="fr-col-10 fr-col-lg-5">
      <VeeCurrencyInput
        :name="`customs[${index}].amount`"
        :label="budgetCustomExpensesKeys.byKey.amount"
      />
    </div>

    <div class="fr-col-2 fr-col-lg-1 delete-custom">
      <DsfrButton
        secondary
        class="btn-delete-action"
        icon-only
        icon="fr-icon-delete-line"
        no-outline
        type="button"
        @click="$emit('remove')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { budgetCustomExpensesKeys } from '~/client/options'

  defineProps<{ index: number }>()

  defineEmits<{ remove: [] }>()
</script>

<style scoped>
  .delete-custom {
    display: flex;
    justify-content: flex-end;
    align-items: end;
  }
</style>
