<template>
  <p class="beneficiarydetails__metas">
    <template v-if="general.birthDate">
      {{ bornLabel }} le {{ formatDate(general.birthDate) }} · </template
    >Dossier N°{{ fileNumber }}
  </p>
</template>

<script lang="ts" setup>
  import { Gender } from '@prisma/client'
  import { GetBeneficiaryGeneral } from '~/server/route'
  import { readableFileNumber } from '~/utils/readableFileNumber'

  const props = withDefaults(
    defineProps<{
      beneficiaryId: string
      general: GetBeneficiaryGeneral
    }>(),
    {}
  )

  const bornLabel = computed(() =>
    props.general.gender === Gender.Female ? 'Née' : 'Né'
  )

  const fileNumber = computed(() => readableFileNumber(props.beneficiaryId))
</script>

<style scoped>
  @media not print {
    .beneficiarydetails__metas {
      margin-bottom: 0;
    }
  }
</style>
