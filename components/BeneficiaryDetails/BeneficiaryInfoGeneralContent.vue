<template>
  <div v-if="hasIdentityInformations(general)">
    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w">
        <h5 class="fr-text--md">Identité du bénéficiaire</h5>
      </div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-6 fr-pb-2w">
        <div class="field-value">
          {{ formatBeneficiaryName(general) }}
        </div>
        <div class="field-value">
          {{ formatBeneficiaryBirthInfo(general) }}
        </div>
      </div>
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.gender"
        :value="beneficiaryGenderKeys.value(general.gender)"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.birthName"
        :value="general.birthName"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.nationality"
        :value="nationalityKeys.value(general.nationality)"
        class="fr-col-6"
      />
    </div>
    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.numeroPegase"
        :value="general.numeroPegase"
        class="fr-col-12"
        hint="Format attendu : A-00-000000"
      />
    </div>
  </div>

  <div v-if="hasAddressInformations(general)">
    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-grid-row">
      <div class="fr-col-12 fr-pb-1w fr-text--bold">Adresse/Hébergement</div>
    </div>

    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationMode"
        :value="
          beneficiaryAccommodationModeKeys.value(general.accommodationMode)
        "
        class="fr-col-12"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationAdditionalInformation"
        :value="general.accommodationAdditionalInformation"
        class="fr-col-12"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.accommodationZone"
        :value="general.accommodationZone"
        class="fr-col-12"
      />
    </div>

    <div class="fr-grid-row">
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.street"
        :value="formatAddress(general)"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.addressComplement"
        :value="general.addressComplement"
        class="fr-col-6"
      />
      <BeneficiaryInfoLabel
        :label="beneficiaryFieldLabels.department"
        :value="general.department"
        class="fr-col-6"
      />
    </div>
  </div>

  <div
    v-if="general.mobility"
    class="fr-grid-row"
  >
    <hr class="fr-col-12 fr-mt-5v" />

    <div class="fr-col-12 fr-pb-1w">
      <h5 class="fr-text--md">Mobilité</h5>
    </div>

    <BeneficiaryInfoLabel
      :value="beneficiaryMobilityKeys.value(general.mobility)"
      class="fr-col-12"
    />
  </div>

  <div
    v-if="general.additionalInformation"
    class="fr-grid-row"
  >
    <hr class="fr-col-12 fr-mt-5v" />
    <div class="fr-col-12 fr-pb-1w">
      <h5 class="fr-text--md">Informations complémentaires</h5>
    </div>
    <div class="field-value fr-col-12">
      {{ general.additionalInformation }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryGeneral } from '~/types/beneficiary'
  import {
    beneficiaryAccommodationModeKeys,
    beneficiaryGenderKeys,
    beneficiaryMobilityKeys,
    nationalityKeys
  } from '~/client/options'
  import {
    formatAddress,
    formatBeneficiaryBirthInfo,
    formatBeneficiaryName,
    hasIdentityInformations
  } from '~/utils/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  defineProps<{
    general: GetBeneficiaryGeneral
  }>()
</script>
