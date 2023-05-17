<template>
  <div
    v-for="(field, idx) in fields"
    :key="field.key"
  >
    <BeneficiaryFormTaxHousehold
      :tax-household="field"
      :index="idx"
      @select-beneficiary="updateBeneficiary"
      @remove-tax-household="remove(idx)"
    />
    <hr class="fr-mt-5w fr-mb-2w" />
  </div>

  <button
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-circle-line"
    type="button"
    @click="push({ id: v4(), caregiver: false })"
  >
    Ajouter un membre du foyer
  </button>
</template>

<script setup lang="ts">
  import { v4 } from 'uuid'
  import { CreateOrUpdateTaxHouseholdInput } from '~/server/schema'
  import { BeneficiarySearchResult } from '~/utils'

  const { push, remove, fields } =
    useFieldArray<CreateOrUpdateTaxHouseholdInput>('taxHousehold.taxHouseholds')

  function updateBeneficiary({
    index,
    beneficiary
  }: {
    index: number
    beneficiary: BeneficiarySearchResult | null
  }) {
    const field = fields.value[index]
    field.value.linkedBeneficiary = beneficiary
  }
</script>
