<template>
  <div>
    <h3>Family File Segmented Control</h3>

    <FamilyFileSegmentedControl
      :members
      @on-change="selected = $event"
    />

    <div>Selectionné : {{ selected }}</div>
  </div>
</template>

<script setup lang="ts">
  import FamilyFileSegmentedControl from './FamilyFileSegmentedControl.vue'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const members: BeneficiaryFileIdentification[] = [
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
  ]

  const selected = ref('')
</script>
