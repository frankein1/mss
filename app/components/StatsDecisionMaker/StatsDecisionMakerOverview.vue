<template>
  <div class="feature-section fr-p-3w overview">
    <div class="overview__item">
      <span class="fr-h2 title-blue fr-mb-0">{{ format(beneficiaries) }}</span>
      <span class="fr-text--sm">
        {{ plural('bénéficiaire', beneficiaries) }}
        <template v-if="newBeneficiaries">
          — dont {{ newBeneficiaries }}
          {{ plural('nouveau', newBeneficiaries, 'x') }}
        </template>
      </span>
    </div>
    <div class="overview__item">
      <span class="fr-h2 title-blue fr-mb-0">{{ format(files) }}</span>
      <span class="fr-text--sm">
        {{ plural('dossier', files) }}
        <template v-if="familyFiles">
          — dont {{ familyFiles }}
          {{ plural('dossier famille', familyFiles) }}
        </template>
      </span>
    </div>
    <div class="overview__item">
      <span class="fr-h2 title-blue fr-mb-0">{{ structureCount }}</span>
      <span class="fr-text--sm">
        {{ plural('structure', structureCount) }}
        {{ structureCount > 1 ? 'concernées' : 'concernée' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    beneficiaries?: number
    newBeneficiaries?: number
    files?: number
    familyFiles?: number
    structureCount: number
  }>()

  function format(quantity?: number) {
    return quantity === undefined ? '—' : quantity.toLocaleString('fr-FR')
  }

  function plural(word: string, quantity?: number, end = 's') {
    return quantity && quantity > 1 ? `${word}${end}` : word
  }
</script>

<style scoped lang="scss">
  .overview {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem 4rem;
  }

  .overview__item {
    display: flex;
    flex-direction: column;
  }
</style>
