<template>
  <ul class="beneficiary-file-details fr-pb-3w">
    <li>N° dossier : {{ fileNumber }}</li>
    <li>Agent(s) référent(s) : {{ referentNames }}</li>
    <li
      v-if="beneficiary.aidantConnectAuthorized"
      class="fr-icon-success-line"
    >
      Mandat Aidant Connect
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/routers'
  import { readableFileNumber } from '~/utils/readableFileNumber'

  const props = withDefaults(
    defineProps<{
      beneficiary: GetBeneficiaryOutput
    }>(),
    {}
  )

  const referentNames = computed(() =>
    props.beneficiary.referents
      .map(referent => getUserDisplayName(referent))
      .join(', ')
  )

  const fileNumber = computed(() => readableFileNumber(props.beneficiary.id))
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .beneficiary-file-details {
    @include dsfr.disable-list-style;

    font-weight: 700;
    margin-top: 0.5rem;
  }
</style>
