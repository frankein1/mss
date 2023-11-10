<template>
  <div class="fr-container">
    <div class="fr-col-12 fr-pb-2w fr-text--bold">Accompagnements</div>
    <ul class="fr-tags-group">
      <li
        v-for="type in followupTypes"
        :key="type.id"
      >
        <p class="fr-tag">
          {{ type.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryFollowupTypes } from '~/server/route'

  defineProps<{
    followupTypes: GetBeneficiaryFollowupTypes
  }>()
</script>
