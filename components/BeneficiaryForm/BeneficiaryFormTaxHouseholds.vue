<template>
  <BeneficiaryFormTaxHousehold
    v-for="(field, idx) in fields"
    :key="field.key"
    :tax-household="field"
    :index="idx"
    :current-beneficiary-id="currentBeneficiaryId"
    @remove-tax-household="removeMemberHousehod(idx)"
  />
  <BeneficiaryFormAddRelative
    name="taxHouseholds"
    add-button-label="Ajouter un membre du foyer"
  />
</template>

<script setup lang="ts">
  import BeneficiaryFormTaxHouseholdsDeletion from './BeneficiaryFormTaxHouseholdsDeletion.vue'
  import { CreateOrUpdateTaxHouseholdInput } from '~/server/schema'

  defineProps<{
    currentBeneficiaryId?: string
  }>()

  const modal = useModal()

  const { remove, fields } =
    useFieldArray<CreateOrUpdateTaxHouseholdInput>('taxHouseholds')

  const removeMemberHousehod = (idx: number) => {
    modal.open(BeneficiaryFormTaxHouseholdsDeletion, {
      title:
        'Attention, toutes les informations (dont les revenus) liées à cette personne seront supprimées',
      delete: () => {
        remove(idx)
        modal.close()
      }
    })
  }
</script>
