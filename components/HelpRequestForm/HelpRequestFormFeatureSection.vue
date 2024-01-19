<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">Caractéristiques du logement demandé</h3>

  <!-- TODO: household composition information -->

  <div class="fr-col-12">
    <VeeInput
      name="taxHouseholdAdditionalInformation"
      :label="housingHelpRequestFieldLabels.taxHouseholdAdditionalInformation"
      type="text"
    />
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeCurrencyInput
      name="maxRent"
      :label="housingHelpRequestFieldLabels.maxRent"
    />
  </div>

  <div class="fr-col-12 fr-col-lg-6">
    <VeeCurrencyInput
      name="maxCharges"
      :label="housingHelpRequestFieldLabels.maxCharges"
    />
  </div>

  <div class="fr-col-12">
    <VeeMultiSelect
      name="housingType"
      :label="housingHelpRequestFieldLabels.housingType"
      :options="housingTypeOptions"
    />
  </div>

  <div class="fr-col-12">
    <VeeMultiSelect
      name="roomCount"
      :label="housingHelpRequestFieldLabels.roomCount"
      :options="roomCountOptions"
    />
  </div>

  <div class="fr-col-12">
    <VeeCheckbox
      :label="housingHelpRequestFieldLabels.isPmr"
      name="isPmr"
    />
  </div>
</template>

<script setup lang="ts">
  import { housingHelpRequestFieldLabels } from '~/client/labels/housingHelpRequest.labels'
  import {
    housingTypeOptions,
    roomCountOptions
  } from '~/client/options/housingHelpRequest'
</script>
