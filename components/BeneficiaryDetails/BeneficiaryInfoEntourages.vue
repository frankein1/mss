<template>
  <BeneficiaryInfoSection
    title="Entourage"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoEntouragesContent :entourages="entourages" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { GetBeneficiaryRelative } from '~/types/beneficiary'
  import { routes } from '~/routes'

  const props = defineProps<{
    beneficiaryId: string
    entourages: GetBeneficiaryRelative[]
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditEntourage.path(props.beneficiaryId)
  )
</script>
