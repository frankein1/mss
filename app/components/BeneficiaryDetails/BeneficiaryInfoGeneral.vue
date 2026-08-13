<template>
  <BeneficiaryInfoSection
    title="Informations générales"
    :edit-link="editLink"
  >
    <BeneficiaryInfoGeneralContent :general="general" />
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryGeneral } from '~~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    general: GetBeneficiaryGeneral
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditInfo.path(props.beneficiaryId)
  )
</script>
