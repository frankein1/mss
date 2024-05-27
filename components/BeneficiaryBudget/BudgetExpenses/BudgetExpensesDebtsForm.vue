<template>
  <section class="feature-section fr-container fr-p-5w fr-mb-3w">
    <h2 class="fr-h2 primary">Dette(s)</h2>

    <DebtForm
      v-for="(field, idx) in fields"
      :key="field.key"
      :index="idx"
      @remove="remove(idx)"
    />

    <DsfrButton
      label="Ajouter une dette"
      type="button"
      icon="fr-icon-add-line"
      tertiary
      no-outline
      @click="push({ id: v4() })"
    />

    <section class="subtotal fr-h4 fr-mt-3w">
      <span>Sous-total dette(s)</span>
      <span class="primary euro-symbol">
        {{ total !== null ? euros(total) : '-' }}
      </span>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { v4 } from 'uuid'
  import { UpdateLoanOrDebtInput } from '~/server/schema'

  defineProps<{ total: number | null }>()

  const { fields, push, remove } = useFieldArray<UpdateLoanOrDebtInput>('debts')
</script>

<style scoped>
  .subtotal {
    display: flex;
    place-content: center space-between;
  }

  .primary {
    color: var(--primary);
  }
</style>
