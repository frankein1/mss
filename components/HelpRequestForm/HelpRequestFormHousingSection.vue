<template>
  <div class="fr-col-12">
    <div class="fr-accordion">
      <h3 class="fr-accordion__title">
        <button
          class="fr-accordion__btn"
          aria-expanded="false"
          aria-controls="help-request-form-housing-section-accordion"
          type="button"
        >
          Caractéristiques du logement demandé
        </button>
      </h3>

      <div
        id="help-request-form-housing-section-accordion"
        class="fr-collapse fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-grid-row--center"
      >
        <BeneficiaryTaxHouseholdsSummary
          :beneficiary-id="beneficiaryId"
          class="fr-col-12"
        />

        <div class="fr-col-12">
          <VeeInput
            name="taxHouseholdAdditionalInformation"
            :label="
              housingHelpRequestFieldLabels.taxHouseholdAdditionalInformation
            "
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
            :options="housingTypeKeys.options"
            :icons="housingTypeIcons"
          />
        </div>

        <div class="fr-col-12">
          <VeeMultiSelect
            name="roomCount"
            :label="housingHelpRequestFieldLabels.roomCount"
            :options="roomCountKeys.options"
          />
        </div>

        <div class="fr-col-12">
          <VeeCheckbox
            :label="housingHelpRequestFieldLabels.isPmr"
            name="isPmr"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { housingHelpRequestFieldLabels } from '~/client/labels'
  import {
    housingTypeKeys,
    housingTypeIcons,
    roomCountKeys
  } from '~/client/options'

  defineProps<{
    beneficiaryId: string
  }>()
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .fr-accordion .fr-accordion__title {
    width: calc(100% + 2rem);
  }

  .fr-accordion .fr-accordion__title .fr-accordion__btn {
    margin-left: -1rem;
    margin-right: -1rem;
    color: inherit;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;

    @include dsfr.title-style(h5);

    &[aria-expanded='true'] {
      background-color: initial;
    }
  }

  .fr-accordion .fr-collapse.fr-grid-row.fr-grid-row--gutters {
    margin: 0 -1.75rem;
    padding-top: 0;
  }
</style>
