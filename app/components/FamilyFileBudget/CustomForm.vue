<template>
  <section
    data-field-group
    class="fr-grid-row fr-grid-row--gutters fr-mb-2w"
  >
    <div class="fr-col-12 fr-col-lg-6">
      <VeeInput
        v-if="type === 'expense'"
        :name="`customs[${index}].type`"
        :label="budgetCustomExpensesKeys.byKey.type"
      />
      <VeeInput
        v-if="type === 'income'"
        :name="`customs[${index}].type`"
        :label="budgetCustomIncomeKeys.byKey.type"
      />
    </div>
    <div class="fr-col-9 fr-col-sm-10 fr-col-lg-5">
      <VeeCurrencyInput
        v-if="type === 'expense'"
        :name="`customs[${index}].amount`"
        :label="budgetCustomExpensesKeys.byKey.amount"
      />
      <VeeCurrencyInput
        v-if="type === 'income'"
        :name="`customs[${index}].amount`"
        :label="budgetCustomIncomeKeys.byKey.amount"
      />
    </div>

    <div class="fr-col-3 fr-col-sm-2 fr-col-lg-1 delete-custom">
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
  import {
    budgetCustomExpensesKeys,
    budgetCustomIncomeKeys
  } from '~~/client/options'

  defineProps<{ index: number; type: 'income' | 'expense' }>()

  defineEmits<{ remove: [] }>()
</script>

<style scoped>
  .delete-custom {
    display: flex;
    justify-content: flex-end;
    align-items: end;
  }
</style>
