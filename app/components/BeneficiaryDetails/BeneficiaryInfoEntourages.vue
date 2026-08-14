<template>
  <BeneficiaryInfoSection
    title="Entourage"
    :edit-link="editLink"
  >
    <BeneficiaryInfoEntouragesContent :entourages="entourages" />
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryRelative } from '~~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    entourages: GetBeneficiaryRelative[]
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditEntourage.path(props.beneficiaryId)
  )
</script>
