<template>
  <p class="fr-my-0">
    <template v-if="beneficiary.birthDate">
      {{ bornLabel }} le {{ formatDate(beneficiary.birthDate) }} · </template
    >Dossier N°{{ fileNumber }}
  </p>
</template>

<script lang="ts" setup>
  import { Gender } from '@prisma/client'
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { readableFileNumber } from '~/utils/readableFileNumber'

  const props = withDefaults(
    defineProps<{
      beneficiary: GetBeneficiaryOutput
    }>(),
    {}
  )

  const bornLabel = computed(() =>
    props.beneficiary.gender === Gender.Female ? 'Née' : 'Né'
  )

  const fileNumber = computed(() => readableFileNumber(props.beneficiary.id))
</script>
~/server/trpc/routers
