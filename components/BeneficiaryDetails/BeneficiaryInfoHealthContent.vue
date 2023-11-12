<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.gir"
      :value="BeneficiaryGirKeys.value(health.gir)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.doctor"
      :value="health.doctor"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.socialSecurityNumber"
      :value="health.socialSecurityNumber"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.insurance"
      :value="health.insurance"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.healthAdditionalInformation"
      :value="health.healthAdditionalInformation"
      class="fr-col-12"
    />
  </div>
</template>

<script lang="ts" setup>
  import { GetBeneficiaryHealth } from '~/types/beneficiary'
  import { BeneficiaryGirKeys } from '~/client/options/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    health: GetBeneficiaryHealth
  }>()
</script>
