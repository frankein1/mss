<template>
  <BeneficiaryFormTaxHousehold
    v-for="(field, idx) in fields"
    :key="field.key"
    :tax-household="field"
    :index="idx"
    :current-beneficiary-id="currentBeneficiaryId"
    @select-beneficiary="updateBeneficiary(idx, $event)"
    @remove-tax-household="remove(idx)"
  />
  <BeneficiaryFormAddRelative
    name="taxHouseholds"
    add-button-label="Ajouter un membre du foyer"
  />
</template>

<script setup lang="ts">
  import { CreateOrUpdateTaxHouseholdInput } from '~/server/schema'
  import { BeneficiarySearchResult } from '~/types/beneficiary'

  defineProps<{
    currentBeneficiaryId: string | null
  }>()

  const { remove, update, fields } =
    useFieldArray<CreateOrUpdateTaxHouseholdInput>('taxHouseholds')

  function updateBeneficiary(
    index: number,
    beneficiary: BeneficiarySearchResult | null
  ) {
    const field = fields.value[index]
    update(index, {
      ...field.value,
      linkedBeneficiary: beneficiary
    })
  }
</script>
