<template>
  <h5 class="fr-m-2w">
    <span
      class="text-big"
      :class="hystoryType"
      >{{ beneficiaryCounts }}&nbsp;</span
    >bénéficiaires concernés
    <span
      v-if="filesCounts"
      class="fr-text--sm"
      >(dont {{ filesCounts }} foyers)</span
    >
  </h5>
</template>

<script lang="ts" setup>
  defineProps<{
    beneficiaryCounts: number
    filesCounts?: number
    hystoryType?: 'followup' | 'helprequest'
  }>()
</script>

<style lang="scss" scoped>
  .text-big {
    font-size: 2.5rem;
  }

  .followup {
    color: var(--color-followup);
  }

  .helprequest {
    color: var(--color-help-request);
  }
</style>
