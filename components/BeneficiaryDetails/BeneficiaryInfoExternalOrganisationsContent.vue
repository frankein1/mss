<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.protectionMeasure"
      :value="
        BeneficiaryProtectionMeasureKeys.value(
          externalOrganisations.protectionMeasure
        )
      "
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.representative"
      :value="externalOrganisations.representative"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.prescribingStructure"
      :value="externalOrganisations.prescribingStructure"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.orientationType"
      :value="
        BeneficiaryOrientationTypeKeys.value(
          externalOrganisations.orientationType
        )
      "
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.orientationStructure"
      :value="externalOrganisations.orientationStructure"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.serviceProviders"
      :value="externalOrganisations.serviceProviders"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.involvedPartners"
      :value="externalOrganisations.involvedPartners"
      class="fr-col-6"
    />
  </div>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryExternalOrganisations } from '~/types/beneficiary'
  import {
    BeneficiaryOrientationTypeKeys,
    BeneficiaryProtectionMeasureKeys
  } from '~/client/options/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    externalOrganisations: GetBeneficiaryExternalOrganisations
  }>()
</script>
