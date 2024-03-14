<template>
  <BeneficiaryFormSection>
    <div class="fr-col-12">
      <VeeSelect
        name="protectionMeasure"
        :label="beneficiaryFieldLabels.protectionMeasure"
        :options="withEmptyValue(beneficiaryProtectionMeasureKeys.options)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="representative"
        :label="beneficiaryFieldLabels.representative"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="prescribingStructure"
        :label="beneficiaryFieldLabels.prescribingStructure"
      />
    </div>
    <div class="fr-col-12">
      <VeeSelect
        name="orientationType"
        :label="beneficiaryFieldLabels.orientationType"
        :options="withEmptyValue(beneficiaryOrientationTypeKeys.options)"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="orientationStructure"
        :label="beneficiaryFieldLabels.orientationStructure"
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="serviceProviders"
        :label="beneficiaryFieldLabels.serviceProviders"
        placeholder="Repas à domicile, aide à domicile..."
      />
    </div>
    <div class="fr-col-12">
      <VeeInput
        name="involvedPartners"
        :label="beneficiaryFieldLabels.involvedPartners"
      />
    </div>
  </BeneficiaryFormSection>
</template>

<script setup lang="ts">
  import {
    beneficiaryOrientationTypeKeys,
    beneficiaryProtectionMeasureKeys
  } from '~/client/options'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'
</script>
