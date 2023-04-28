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

  const referentNames = props.beneficiary.referents
    .map(referent => getUserDisplayName(referent))
    .join(', ')

  const fileNumber = readableFileNumber(props.beneficiary.id)
</script>
