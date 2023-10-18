<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.gir"
      :value="BeneficiaryGirKeys.value(beneficiary.gir)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.doctor"
      :value="beneficiary.doctor"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.socialSecurityNumber"
      :value="beneficiary.socialSecurityNumber"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.insurance"
      :value="beneficiary.insurance"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.healthAdditionalInformation"
      :value="beneficiary.healthAdditionalInformation"
      class="fr-col-12"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { BeneficiaryGirKeys } from '~/client/options/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()
</script>
