<template>
  <div class="fr-m-2w fr-grid-row">
    <div class="fr-col-6">
      <span
        class="text-big fr-h2"
        :class="historyType"
        >{{ beneficiaryCounts }}&nbsp;</span
      >
      <span class="fr-h5">
        <template v-if="historyType === 'beneficiary'">
          {{
            `${plural('dossier', beneficiaryCounts)} ${plural('bénéficiaire', beneficiaryCounts)}`
          }}
        </template>
        <template v-else>{{
          `${plural('bénéficiaire', beneficiaryCounts)} ${plural('concerné', beneficiaryCounts)}`
        }}</template></span
      >
    </div>

    <div
      v-if="familyCounts"
      class="fr-col-6"
    >
      <span
        class="text-big fr-h2"
        :class="historyType"
        >{{ familyCounts }}&nbsp;</span
      >
      <span class="fr-h5">{{
        `${plural('dossier', familyCounts)} ${plural('foyer', familyCounts)}`
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    beneficiaryCounts: number
    familyCounts?: number
    historyType?: 'followup' | 'helprequest' | 'beneficiary'
  }>()

  const plural = (word: string, q: number) => (q > 1 ? `${word}s` : word)
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

  .beneficiary {
    color: var(--primary);
  }
</style>
