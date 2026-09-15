<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-lg-6 fr-pb-1w">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.gir"
        :value="beneficiaryGirKeys.value(health.gir)"
      />
    </div>

    <div class="fr-col-12 fr-col-lg-6 fr-pb-1w">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.doctor"
        :value="health.doctor"
      />
    </div>
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-lg-6 fr-pb-1w">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.socialSecurityNumber"
        :value="health.socialSecurityNumber"
      />
    </div>

    <div class="fr-col-12 fr-col-lg-6 fr-pb-1w">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.insurance"
        :value="health.insurance"
      />
    </div>
  </div>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-pb-1w">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.healthAdditionalInformation"
        :value="health.healthAdditionalInformation"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryHealth } from '~~/types/beneficiary'
  import { beneficiaryGirKeys } from '~~/client/options'
  import { beneficiaryFieldLabels } from '~~/client/labels/beneficiary.labels'

  defineProps<{
    health: GetBeneficiaryHealth
  }>()
</script>
