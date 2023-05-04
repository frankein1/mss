<template>
  <ul class="beneficiary-file-details">
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
  import { Beneficiary, User } from '@prisma/client'
  import { readableFileNumber } from '~/utils/readableFileNumber'

  const props = withDefaults(
    defineProps<{
      beneficiary: Pick<Beneficiary, 'id' | 'aidantConnectAuthorized'> & {
        referents: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>[]
      }
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
