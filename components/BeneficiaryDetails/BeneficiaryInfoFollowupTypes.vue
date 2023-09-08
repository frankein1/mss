<template>
  <div class="fr-container">
    <div class="fr-grid-row text-bold fr-pb-2w">Accompagnements</div>
    <div class="fr-grid-row">
      <div
        v-for="type in followupTypes"
        :key="type.id"
        class="bg-color-grey-light fr-p-1w fr-mr-1w fr-mb-1w fr-text--sm br-16"
      >
        {{ type.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryFollowupTypesOutput } from '~/server/routers'

  defineProps<{
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()
</script>
