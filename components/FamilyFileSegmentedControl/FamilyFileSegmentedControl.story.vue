<template>
  <div>
    <h3>Family File Segmented Control</h3>

    <FamilyFileSegmentedControl
      v-model="selected"
      :members
    />

    <div>Selectionné : {{ selected }}</div>
  </div>
</template>

<script setup lang="ts">
  import FamilyFileSegmentedControl from './FamilyFileSegmentedControl.vue'
  import type { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const members = [
    {
      id: 'membre-principal',
      firstName: 'Camille',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('1965-11-25'),
      relationship: null
    },
    {
      id: 'conjoint',
      firstName: 'Jean',
      usualName: 'TEARLE',
      birthName: null,
      birthDate: new Date('1969-12-04'),
      relationship: 'Conjoint'
    }
  ] satisfies [BeneficiaryFileIdentification, BeneficiaryFileIdentification]

  const selected = ref(members[1].id)
</script>
