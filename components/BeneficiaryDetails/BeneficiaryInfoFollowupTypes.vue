<template>
  <div class="fr-container">
    <div class="fr-col-12 fr-pb-2w fr-text--bold">Accompagnements</div>
    <div class="fr-grid-row">
      <div
        v-for="type in followupTypes"
        :key="type.id"
        class="bg-color-grey-light fr-py-1v fr-px-3v fr-mr-1w fr-mb-1w fr-text--sm br-16"
      >
        {{ type.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryFollowupTypesOutput } from '~/server/trpc/routers'

  defineProps<{
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()
</script>
