<template>
  <div class="result">
    <div class="name-status">
      <AtomTextEmphasis
        class="fr-text--regular fr-text--lg fr-mr-1w fr-mb-0 text--primary result-name"
        :name="formatBeneficiarySearchDisplayName(beneficiary)"
        :input="search"
      />
      <BeneficiaryStatusBadge
        v-if="showStatus"
        :status="beneficiary.status"
        small
      />
    </div>
    <div
      v-if="beneficiary.birthDate || beneficiary.phone1"
      class="fr-grid-row text--muted fr-text--regular fr-text--sm whitespace-pre-wrap fr-mt-1v"
    >
      <span v-if="beneficiary.birthDate && !showAge">{{
        formatDate(beneficiary.birthDate)
      }}</span>
      <span v-if="beneficiary.birthDate && showAge">{{
        calculateAge(beneficiary.birthDate) + ' ans'
      }}</span>
      <template v-if="beneficiary.phone1">
        <span v-if="beneficiary.birthDate"> – </span>
        <span class="fr-sr-only">Téléphone : </span>
        <span>{{ beneficiary.phone1 }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BeneficiarySearchResult } from '~/types/beneficiary'

  defineProps<{
    search: string | undefined
    showStatus?: boolean
    showAge?: boolean
    beneficiary: BeneficiarySearchResult
  }>()
</script>

<style lang="scss" scoped>
  .result {
    .name-status {
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
    }
  }
</style>
