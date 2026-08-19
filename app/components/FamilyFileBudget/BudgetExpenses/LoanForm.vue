<template>
  <section
    data-field-group
    class="fr-grid-row fr-grid-row--gutters"
  >
    <div class="fr-col-9 fr-col-sm-10 fr-col-lg-11">
      <VeeInput
        :name="`loans[${index}].type`"
        :label="budgetLoansKeys.byKey.type"
      />
    </div>

    <div class="fr-col-3 fr-col-sm-2 fr-col-lg-1 delete-loan">
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

    <div class="fr-col-12 fr-col-sm-4">
      <VeeInput
        :name="`loans[${index}].dueDate`"
        :label="budgetLoansKeys.byKey.dueDate"
        type="date"
      />
    </div>

    <div class="fr-col-12 fr-col-sm-4">
      <VeeCurrencyInput
        :name="`loans[${index}].amountTotal`"
        :label="budgetLoansKeys.byKey.amountTotal"
      />
    </div>

    <div class="fr-col-12 fr-col-sm-4">
      <VeeCurrencyInput
        :name="`loans[${index}].amountPerMonth`"
        :label="budgetLoansKeys.byKey.amountPerMonth"
      />
    </div>
  </section>

  <hr class="separator" />
</template>

<script setup lang="ts">
  import { budgetLoansKeys } from '~~/client/options'

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
