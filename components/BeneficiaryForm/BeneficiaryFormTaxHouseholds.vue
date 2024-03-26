<template>
  <BeneficiaryFormTaxHousehold
    v-for="(field, idx) in fields"
    :key="field.key"
    :tax-household="field"
    :index="idx"
    :current-beneficiary-id="currentBeneficiaryId"
    @remove-tax-household="remove(idx)"
  />
  <BeneficiaryFormAddRelative
    name="taxHouseholds"
    add-button-label="Ajouter un membre du foyer"
  />
</template>

<script setup lang="ts">
  import { CreateOrUpdateTaxHouseholdInput } from '~/server/schema'

  defineProps<{
    currentBeneficiaryId?: string
  }>()

  const { remove, fields } =
    useFieldArray<CreateOrUpdateTaxHouseholdInput>('taxHouseholds')
</script>
