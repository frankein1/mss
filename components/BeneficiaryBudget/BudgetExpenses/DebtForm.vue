<template>
  <section class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-11">
      <VeeInput
        :name="`debts[${index}].type`"
        :label="budgetDebtsKeys.byKey.type"
      />
    </div>

    <div class="fr-col-1 delete-loan">
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

    <div class="fr-col-4">
      <VeeInput
        :name="`debts[${index}].dueDate`"
        :label="budgetDebtsKeys.byKey.dueDate"
        type="date"
      />
    </div>

    <div class="fr-col-4">
      <VeeCurrencyInput
        :name="`debts[${index}].amountTotal`"
        :label="budgetDebtsKeys.byKey.amountTotal"
      />
    </div>

    <div class="fr-col-4">
      <VeeCurrencyInput
        :name="`debts[${index}].amountPerMonth`"
        :label="budgetDebtsKeys.byKey.amountPerMonth"
      />
    </div>
  </section>

  <hr class="separator" />
</template>

<script setup lang="ts">
  import { budgetDebtsKeys } from '~/client/options'

  defineProps<{ index: number }>()

  defineEmits<{ remove: [] }>()
</script>

<style scoped>
  .separator {
    height: 0.0625rem;
    background-color: var(--border-default-grey);
    padding: 0;
    margin: 2rem 0;
  }

  .delete-loan {
    display: flex;
    justify-content: flex-end;
    align-items: end;
  }
</style>
