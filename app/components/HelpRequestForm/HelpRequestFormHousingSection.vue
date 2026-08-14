<template>
  <h3 class="fr-h4">Caractéristiques du logement demandé</h3>
  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
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

    <div class="fr-col-12 fr-col-lg-6">
      <VeeMultiSelect
        name="housingType"
        :label="housingHelpRequestFieldLabels.housingType"
        :options="housingTypeKeys.options"
        :icons="housingTypeIcons"
        label-class="fr-text--regular"
      />
    </div>

    <div class="fr-col-12 fr-col-lg-6">
      <VeeMultiSelect
        name="roomCount"
        :label="housingHelpRequestFieldLabels.roomCount"
        :options="roomCountKeys.options"
        label-class="fr-text--regular"
      />
    </div>

    <div class="fr-col-12 fr-col-lg-6 fr-mr-auto">
      <VeeMultiSelect
        name="lowIncomeHousingType"
        :label="housingHelpRequestFieldLabels.lowIncomeHousingType"
        :options="lowIncomeHousingKeys.options"
        label-class="fr-text--regular"
      />
    </div>

    <div class="fr-col-12">
      <VeeCheckbox
        :label="housingHelpRequestFieldLabels.isPmr"
        name="isPmr"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { housingHelpRequestFieldLabels } from '~~/client/labels'
  import {
    housingTypeKeys,
    housingTypeIcons,
    roomCountKeys,
    lowIncomeHousingKeys
  } from '~~/client/options'
</script>
