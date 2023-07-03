<template>
  <section class="beneficiary-details-section">
    <h2 class="fr-h5">Accompagnements du bénéficiaire</h2>
    <section class="beneficiary-details-section">
      <h3 class="fr-text--lg">Aides légales</h3>
      <p v-if="!hasLegallyRequiredFollowupTypes">Aucune</p>
      <ul class="fr-raw-list followup-types-list">
        <li
          v-for="type in followupTypes.legallyRequired"
          :key="type.id"
          class="fr-icon-check-line"
        >
          {{ type.name }}
        </li>
      </ul>
    </section>
    <section class="beneficiary-details-section">
      <h3 class="fr-text--lg">Aides facultatives</h3>
      <p v-if="!hasLegallyNotRequiredFollowupTypes">Aucune</p>
      <ul class="fr-raw-list followup-types-list">
        <li
          v-for="type in followupTypes.legallyNotRequired"
          :key="type.id"
          class="fr-icon-check-line"
        >
          {{ type.name }}
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryFollowupTypesOutput } from '~/server/routers'

  const props = defineProps<{
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()

  const hasLegallyRequiredFollowupTypes = computed(
    () => props.followupTypes.legallyRequired.length
  )
  const hasLegallyNotRequiredFollowupTypes = computed(
    () => props.followupTypes.legallyNotRequired.length
  )
</script>

<style scoped lang="scss">
  .followup-types-list {
    --li-bottom: 0.5rem;

    > .fr-icon-check-line::before {
      color: var(--blue-france-sun-113-625);
    }
  }
</style>
