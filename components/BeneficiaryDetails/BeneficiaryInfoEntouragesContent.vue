<template>
  <ul class="fr-grid-row fr-grid-row--gutters information-list">
    <li
      v-for="(entourage, index) in entourages"
      :key="entourage?.id"
      class="fr-col-12"
    >
      <hr
        v-if="index > 0"
        class="fr-col-12 fr-mt-5v"
      />
      <BeneficiaryInfoRelative :relative="entourage" />
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryRelative } from '~/types/beneficiary'

  defineProps<{
    entourages: GetBeneficiaryRelative[]
  }>()
</script>
