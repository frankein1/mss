<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div
        v-for="entourage in entourages"
        :key="entourage.id"
        class="fr-col-12"
      >
        <hr class="divider" />
        <BeneficiaryInfoRelative :relative="entourage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'

  defineProps<{
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()
</script>
