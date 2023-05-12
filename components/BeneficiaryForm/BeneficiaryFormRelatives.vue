<template>
  <template
    v-for="(relative, index) in relatives"
    :key="relative.id"
  >
    <BeneficiaryFormRelative
      :relative="relative"
      :index="index"
      :household="household"
      :current-beneficiary-id="beneficiaryId"
      @remove-relative="$emit('removeRelative', relative.id)"
    />
    <hr class="fr-mt-5w fr-mb-2w" />
  </template>

  <button
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-circle-line"
    type="button"
    @click="$emit('addRelative')"
  >
    {{ addButtonLabel }}
  </button>
</template>

<script setup lang="ts">
  import { BeneficiaryRelativeWithBeneficiary } from '~/utils/beneficiary'

  const props = defineProps<{
    beneficiaryId: string
    relatives: BeneficiaryRelativeWithBeneficiary[]
    household: boolean
  }>()

  defineEmits(['removeRelative', 'addRelative'])

  const addButtonLabel = computed(() =>
    props.household ? 'Ajouter un membre du foyer' : 'Ajouter un proche'
  )
</script>
