<template>
  <section class="beneficiary-details-section">
    <h2 class="fr-h6">Accompagnements</h2>
    <ul class="fr-tags-group">
      <li
        v-for="type in [
          ...followupTypes.legallyRequired,
          ...followupTypes.legallyNotRequired
        ]"
        :key="type.id"
        class="fr-tag"
      >
        {{ type.name }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryFollowupTypesOutput } from '~/server/routers'

  defineProps<{
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()
</script>

<style scoped lang="scss">
  .fr-tags-group > li {
    line-height: normal;
  }
</style>
