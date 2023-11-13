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
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    entourages: GetBeneficiaryRelative[]
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditEntourage(props.beneficiaryId)
  )
</script>
